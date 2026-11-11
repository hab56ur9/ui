import { Badge, Browser, Button, Callout, Card, ChangeLog, Cons, DataTable, Doc, DocSection, Figure, Meter, Option, Options, Page, Phone, Pros, Ref, RequirementTable, Row, Steps, TextList, Widget, WidgetGrid } from "ui";

const OFFERS = [
  { title: "Install a coffee brand app", reward: "300P", tone: "main" as const, badge: "Install" },
  { title: "Request an insurance consultation", reward: "1,500P", tone: "main" as const, badge: "Action" },
  { title: "Watch a 30-second new-season clip", reward: "50P", tone: "neutral" as const, badge: "Video" },
];

function OfferList() {
  return (
    <div className="stack">
      <Callout tone="info" title="Points you can earn today">
        3 offers · up to 1,850P
      </Callout>
      {OFFERS.map((offer) => (
        <Card key={offer.title} title={offer.title} aside={<Badge tone={offer.tone}>{offer.badge}</Badge>} description={`Earn ${offer.reward} when you join`}>
          <Button variant="primary">{`Get ${offer.reward}`}</Button>
        </Card>
      ))}
    </div>
  );
}

function OfferDetail() {
  return (
    <div className="stack">
      <Card title="Install a coffee brand app" description="Install the app and open it once to earn 300P.">
        <TextList ordered items={["Install the app from the store.", "Open the installed app once.", "Points arrive once it is confirmed."]} />
      </Card>
      <Callout tone="warning" title="Apps you already installed do not earn points">
        Reinstalling does not count either.
      </Callout>
      <Button variant="primary">Go install</Button>
    </div>
  );
}

function Rewarded() {
  return (
    <div className="stack">
      <Callout tone="good" title="300P earned">
        Install a coffee brand app · just now
      </Callout>
      <Card title="My points" description="Earned this month 2,150P">
        <Meter label="Monthly earning limit" value={2150} max={5000} format={(v) => `${v.toLocaleString()}P`} />
      </Card>
      <Button>See more offers</Button>
    </div>
  );
}

export function PrdEn() {
  return (
    <Doc
      title="Point mission ads"
      summary="Users earn points for joining offers in the in-app offer list, and advertisers pay only for completed actions."
      meta={{ status: "review", authors: ["Ad product team"], reviewers: ["Platform team", "Design system owner"], date: "2026-11-11", version: "0.2" }}
    >
      <DocSection title="Goals and metrics">
        <p>Users who take part earn a reward, and advertisers are charged only for actual actions.</p>
        <DataTable
          fit
          columns={[{ label: "Metric" }, { label: "Definition" }, { label: "Target", numeric: true }]}
          rows={[
            ["Completion rate", "Rewards over detail views", "18%"],
            ["Reward delay", "From completion to points shown", "Under 10 s"],
            ["Duplicate rewards", "A second reward for the same user and offer", "0"],
          ]}
        />
      </DocSection>
      <DocSection title="User flow">
        <Steps
          items={[
            { title: "List", body: "See today's offers and their points." },
            { title: "Detail", body: "Read how to join and the reward conditions." },
            { title: "Join", body: "Finish the action in the advertiser's app or page." },
            { title: "Reward", body: "Points arrive with a notice once confirmed." },
          ]}
        />
      </DocSection>
      <DocSection title="Screens">
        <Figure caption="User screens: list (S1), detail (S2), rewarded (S3)">
          <Row>
            <Phone scale={0.5}>
              <OfferList />
            </Phone>
            <Phone scale={0.5}>
              <OfferDetail />
            </Phone>
            <Phone scale={0.5}>
              <Rewarded />
            </Phone>
          </Row>
        </Figure>
      </DocSection>
      <DocSection title="Behavior spec">
        <p>
          Each item reads condition → result. Buttons on the list (S1) follow <Ref to="R1" />, the notice on the detail (S2) follows <Ref to="R3" />, and the rewarded screen (S3) follows <Ref to="R4" />.
        </p>
        <RequirementTable
          items={[
            { text: "Tapping an offer on S1 → opens S2 and records a detail view.", priority: "must", status: "done" },
            { text: "No offer is available → S1 shows an empty message and the next refresh time.", priority: "must", status: "done" },
            { text: "The user already joined the offer → S2 disables its button and explains why.", priority: "must", status: "open" },
            { text: "The advertiser confirms → points arrive within 10 s with S3 and a notice.", priority: "must", status: "open" },
            { text: "A second confirmation for the same user and offer → no reward, only a log entry.", priority: "must", status: "open", note: "Duplicate guard" },
            { text: "The monthly limit is reached → S1 shows a limit notice and disables join buttons.", priority: "should", status: "open" },
          ]}
        />
      </DocSection>
      <DocSection title="States">
        <DataTable
          fit
          columns={[{ label: "State" }, { label: "Screen" }, { label: "When" }, { label: "Shown" }]}
          rows={[
            ["Loading", "S1", "After the list request, before the reply", "Three card placeholders"],
            ["Empty", "S1", "No offer available", "Empty message, next refresh time"],
            ["Error", "S1, S2", "The request failed", "A retry button"],
            ["Pending", "S3", "Action done, not yet confirmed", "A checking notice, up to 10 s"],
          ]}
        />
      </DocSection>
      <DocSection title="Events">
        <DataTable
          fit
          columns={[{ label: "Event" }, { label: "When" }, { label: "Properties" }]}
          rows={[
            ["offer_list_view", "S1 is shown", "Offer count"],
            ["offer_detail_view", "S2 opens", "Offer ID, reward"],
            ["offer_participate", "Join tapped", "Offer ID"],
            ["reward_granted", "Points granted", "Offer ID, points, delay (s)"],
          ]}
        />
      </DocSection>
      <DocSection title="Operations screen">
        <Figure caption="Advertiser budget screen (O1): budget spent and completions">
          <Browser address="ads.example.com/campaigns" width={1200} height="auto">
            <Page title="Campaign budgets">
              <WidgetGrid>
                <Widget id="pacing" title="Budget pacing" w={5} h={4}>
                  <div className="stack">
                    <Meter label="Coffee brand app install · monthly budget" value={6600000} max={21300000} target={7100000} format={(v) => `₩${(v / 1000000).toFixed(1)}M`} status="warning" note="Spending slower than planned." />
                    <Meter label="Insurance consultation · monthly budget" value={15800000} max={20000000} target={14200000} format={(v) => `₩${(v / 1000000).toFixed(1)}M`} status="good" />
                  </div>
                </Widget>
                <Widget id="results" title="Results by offer" w={7} h={4}>
                  <DataTable
                    fit
                    columns={[{ label: "Offer" }, { label: "Joined", numeric: true }, { label: "Rewarded", numeric: true }, { label: "Completion", numeric: true }]}
                    rows={[
                      ["Install a coffee brand app", "4,210", "3,982", "17.8%"],
                      ["Request an insurance consultation", "1,054", "1,031", "21.2%"],
                      ["Watch a 30-second new-season clip", "12,480", "12,402", "64.0%"],
                    ]}
                  />
                </Widget>
              </WidgetGrid>
            </Page>
          </Browser>
        </Figure>
      </DocSection>
      <DocSection title="Open questions">
        <Options>
          <Option name="Reward after confirmation" recommended>
            <Pros>
              <li>Blocks duplicate and fraudulent rewards.</li>
            </Pros>
            <Cons>
              <li>Users wait up to 10 seconds.</li>
            </Cons>
          </Option>
          <Option name="Reward now, claw back later">
            <Pros>
              <li>The reward shows at once.</li>
            </Pros>
            <Cons>
              <li>Clawbacks upset users.</li>
            </Cons>
          </Option>
        </Options>
      </DocSection>
      <DocSection title="Change history">
        <ChangeLog
          items={[
            { version: "0.2", date: "2026-11-11", author: "Ad product team", note: "Added the duplicate guard and the monthly limit." },
            { version: "0.1", date: "2026-11-04", author: "Ad product team", note: "First draft" },
          ]}
        />
      </DocSection>
    </Doc>
  );
}
