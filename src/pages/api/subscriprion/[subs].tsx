/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient, type Subscription } from '@prisma/client'
import { type NextApiRequest, type NextApiResponse } from 'next';
const prisma = new PrismaClient()
export interface NewApiRequest extends NextApiRequest {
  body: {
    nickname: string;
    subscriprion: string;
    balance: number;
  };
}
export default async function Page(req: NewApiRequest, res: NextApiResponse) {
  try {
    switch (req.query.subs) {
      case "buy":
        const nickname = req.body.nickname
        const subscription2 = req.body.subscriprion as Subscription
        const balance = req.body.balance
        const aftermonth = new Date()
        aftermonth.setMonth(aftermonth.getMonth() + 1);
        if (nickname && subscription2 && balance) {
          const moreInfo = await prisma.user.findFirst({
            where: {
              id: nickname
            },
            select: {
              subscription: true, addedPlayers: true, subscriptionOwner: true, noSubscriptionOwnerYet: true, noPlayersAddedYet: true
            }
          })
          if (moreInfo?.addedPlayers && moreInfo?.subscriptionOwner && moreInfo?.noSubscriptionOwnerYet && moreInfo?.noPlayersAddedYet && moreInfo?.subscription) {
            const subscriptionBefore = moreInfo.subscription
            if (subscriptionBefore === "MAX" || subscriptionBefore === "MULTI") {
              for (let i = 0; i < moreInfo.addedPlayers.length; i++) {
                await prisma.user.update({
                  where: { nickname: moreInfo.addedPlayers[i] },
                  data: {
                    subscription: "NO",
                    addedPlayers: [],
                    subscriptionOwner: null,
                    noPlayersAddedYet: [],
                    expirydate: null
                  }
                });
              }
              for (let i = 0; i < moreInfo.addedPlayers.length; i++) {
                await prisma.user.update({
                  where: { nickname: moreInfo.noPlayersAddedYet[i] },
                  data: {
                    noSubscriptionOwnerYet: null
                  }
                });
              }

            } else if (subscriptionBefore === "NO") {
              if (moreInfo.noSubscriptionOwnerYet) {
                const noSubscriptionOwnerYetInfo = await prisma.user.findFirst({
                  where: { nickname: moreInfo.noSubscriptionOwnerYet },
                  select: { addedPlayers: true, noPlayersAddedYet: true }
                });
                if (noSubscriptionOwnerYetInfo?.addedPlayers && noSubscriptionOwnerYetInfo.noPlayersAddedYet) {
                  delete noSubscriptionOwnerYetInfo.noPlayersAddedYet[noSubscriptionOwnerYetInfo.noPlayersAddedYet.indexOf(nickname)];
                  await prisma.user.update({
                    where: { nickname: moreInfo.noSubscriptionOwnerYet },
                    data: {
                      noPlayersAddedYet: noSubscriptionOwnerYetInfo.noPlayersAddedYet
                    }
                  });
                  for (let i = 0; i < noSubscriptionOwnerYetInfo.addedPlayers.length; i++) {
                    await prisma.user.update({
                      where: { nickname: noSubscriptionOwnerYetInfo.addedPlayers[i] },
                      data: {
                        noPlayersAddedYet: noSubscriptionOwnerYetInfo.noPlayersAddedYet
                      }
                    });
                  }
                }
              } else if (moreInfo.subscriptionOwner) {
                delete moreInfo.addedPlayers[moreInfo.addedPlayers.indexOf(nickname)];
                await prisma.user.update({
                  where: { nickname: moreInfo.subscriptionOwner },
                  data: {
                    noPlayersAddedYet: moreInfo.addedPlayers
                  }
                });
                for (let i = 0; i < moreInfo.addedPlayers.length; i++) {
                  await prisma.user.update({
                    where: { nickname: moreInfo.addedPlayers[i] },
                    data: {
                      addedPlayers: moreInfo.addedPlayers
                    }
                  });
                }
              }
            }
          }

          await prisma.user.update({
            where: { nickname: nickname },
            data: { subscription: subscription2, balance: balance - (subscription2 === "ONE" ? 16 : subscription2 === "MULTI" ? 24 : 32), expirydate: aftermonth, addedPlayers: [], noPlayersAddedYet: [], noSubscriptionOwnerYet: null, subscriptionOwner: nickname }
          });
        }
        break
    }
    res.status(200).json({ "code": 1 });
  }
  catch (error) {
    res.json(error);
    res.status(500).end();
  }


}