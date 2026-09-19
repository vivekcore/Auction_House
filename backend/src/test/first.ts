const BASE_URL = "http://localhost:3000";
const AUCTION_ID = "6aae631fc8644c719f5913a9";

const users = Array.from({ length: 10 }, (_, i) => ({
  username:`raceuser${i+1}`,
    name: `Race User ${i + 1}`,
    email: `race-user-${i + 1}@test.com`,
    password: "TestPassword123!",
}));

async function createUser(user: (typeof users)[number]) {
   const response = await fetch(`${BASE_URL}/api/v1/auth/sign-up/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Origin:BASE_URL
        },
        body: JSON.stringify(user),
    });

  // User may already exist from a previous test
  if (response.ok) {
    console.log(`Created ${user.email}`);
  }

  return user;
}

async function login(user: (typeof users)[number]) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/sign-in/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Origin:BASE_URL
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password,
        }),
    });

  if (!response.ok) {
    throw new Error(
      `Login failed for ${user.email}: ${await response.text()}`
    );
  }

  const cookie = response.headers.get("set-cookie");

  if (!cookie) {
    throw new Error(`No session cookie for ${user.email}`);
  }

  return cookie;
}

async function placeBid(
  cookie: string,
  userNumber: number,
  amount: number
) {
 const response = await fetch(`${BASE_URL}/api/v1/bid/place`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
        },
        body: JSON.stringify({
            auctionId: AUCTION_ID,
            amount
        }),
    });

  return {
    user: userNumber,
    amount,
    status: response.status,
    body: await response.text(),
  };
}

async function main() {
  console.log("Creating users...\n");

  await Promise.all(
    users.map((user) => createUser(user))
  );

  console.log("\nLogging in users...\n");

  const sessions = await Promise.all(
    users.map(async (user) => ({
      user,
      cookie: await login(user),
    }))
  );

  console.log("10 users authenticated.");
  console.log("Sending bids simultaneously...\n");

  const requests = sessions.map((session, index) =>
    placeBid(
      session.cookie,
      index + 1,
      1010 + index * 10
    )
  );

  const start = performance.now();

  const results = await Promise.all(requests);

  console.log(
    `Finished in ${Math.round(
      performance.now() - start
    )}ms\n`
  );

  for (const result of results) {
    console.log(
      `User ${result.user} | ₹${result.amount} | ${result.status}`
    );

    console.log(result.body);
    console.log("---");
  }
}

main().catch(console.error);