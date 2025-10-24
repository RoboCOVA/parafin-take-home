import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ParafinWidget } from "@parafin/react";
import { Header } from "./components/Header.tsx";
import { SideNav } from "./components/SideNav.tsx";


function App() {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState("capital");
  const [personId] = useState("person_real_ID"); // Static person ID for demo
  //Generate Sandbox Env.  Real ID  using Postman collection 

  const [uiState, setUiState] = useState("no-offers"); // Track Flex Loan state
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data: tokenData } = await axios.get(
          `/parafin/token/${personId}`
        );
        const parafinToken = tokenData.parafinToken;
        setToken(parafinToken);
        console.log("Fetched Parafin token:", parafinToken);

        const { data: offersData } = await axios.get("/offer", {
          headers: { Authorization: `Bearer ${parafinToken}` },
          // params: {
          //   businessParafinId: "<BUSINESS_PARAFIN_ID>", // Replace with your BUSINESS_PARAFIN_ID
          //   businessExternalId: "<BUSINESS_EXTERNAL_ID>", // Replace with your BUSINESS_EXTERNAL_ID
          // },
        });

        const offersList = offersData.results;
        console.log("Fetched offers:", offersList);
        setOffers(offersList);
        setUiState(offersList.length ? "pre-approved" : "no-offers");
      } catch (err) {
        console.error("Error fetching Parafin token or offers:", err);
          
      }
    };

    fetchToken(); // Just call it once when component mounts
  }, [personId]); // Only depend on personId

  const onOptIn = async () => ({
    businessExternalId: "business_997dd6b7-a112-4852-8b13-11e5e7bec975",
    legalBusinessName: "Hearty Kitchens LLC",
    dbaName: "Hearty Kitchens",
    ownerFirstName: "Ralph",
    ownerLastName: "Furman",
    accountManagers: [
      {
        name: "Vineet Goel",
        email: "test1@parafin.com",
      },
    ],
    routingNumber: "121141822",
    accountNumberLastFour: "6789",
    bankAccountCurrencyCode: "USD",
    email: "test2@parafin.com",
    phoneNumber: "2026331000",
    address: {
      addressLine1: "301 Howard St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA",
    },
  });

  if (!token) return <LoadingShell>loading...</LoadingShell>;

  return (
    <div>
      <Header />
      <ContentShell>
        <SideNav onClick={(newProduct) => setTab(newProduct)} />
        {tab === "capital" && (
          <PageShell>
            <StateButtons>
              {/* <button onClick={() => setUiState("no-offers")}>
                No Offers Available
              </button>
              <button onClick={() => setUiState("pre-approved")}>
                Pre-approved Offer
              </button>
              <button onClick={() => setUiState("capital-on-its-way")}>
                Capital On Its Way
              </button>
              <button onClick={() => setUiState("offer-accepted")}>
                Offer Accepted
              </button> */}

              {/* Dynamic buttons based on offers array */}
              {!offers.length && (
                <button onClick={() => setUiState("no-offers")}>
                  No Offers Available
                </button>
              )}
              {offers.length > 0 && (
                <>
                  {offers.map((offer, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUiState("pre-approved")}
                    >
                      Pre-approved Offer{" "}
                      {offers.length > 1 ? `#${idx + 1}` : ""}
                    </button>
                  ))}
                </>
              )}
            </StateButtons>

            <ParafinWidget
              token={token}
              product="capital"
              personId={personId}
              uiState={uiState} // Optional: simulate different states
              onOptIn={onOptIn}
            />
          </PageShell>
        )}
        {tab === "analytics" && (
          <PageShell>
            <h2>Analytics</h2>
          </PageShell>
        )}
        {tab === "payouts" && (
          <PageShell>
            <h2>Payouts</h2>
          </PageShell>
        )}
      </ContentShell>
    </div>
  );
}

export default App;

// --- Styled Components ---
const ContentShell = styled.div`
  display: flex;
  flex-direction: row;
`;

const LoadingShell = styled.div`
  padding: 20px;
  font-size: 18px;
`;

const PageShell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 40px;
  max-width: 1100px;
`;

const StateButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  button {
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    transition: background-color 0.2s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;
