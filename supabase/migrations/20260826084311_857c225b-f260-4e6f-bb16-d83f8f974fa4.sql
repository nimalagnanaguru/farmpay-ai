CREATE TABLE public.farmer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  state text NOT NULL,
  district text,
  landholding_ha numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  primary_crops text[] NOT NULL DEFAULT '{}',
  irrigation_access boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.farmer_profiles TO anon, authenticated;
GRANT ALL ON public.farmer_profiles TO service_role;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a farmer profile" ON public.farmer_profiles FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'potential',
  land_limit text,
  summary text NOT NULL,
  grant_value numeric NOT NULL DEFAULT 0,
  portal_url text,
  eligibility_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  documents text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schemes TO anon, authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Schemes are publicly readable" ON public.schemes FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.schemes (title, category, status, land_limit, summary, grant_value, portal_url, eligibility_rules, documents) VALUES
('PM-KISAN Samman Nidhi','Income Support','eligible','Up to 2 ha','Direct income support of Rs 6,000 per year paid in three equal instalments to landholding farmer families.',6000,'https://pmkisan.gov.in','[{"rule":"Landholding on record in farmer name","passed":true},{"rule":"Not an income tax payer","passed":true},{"rule":"Aadhaar seeded bank account","passed":true},{"rule":"Not a government employee","passed":false}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook"}'),
('Pradhan Mantri Fasal Bima Yojana (PMFBY)','Crop Insurance','eligible','No limit','Crop insurance against yield loss with premium of just 2% for kharif and 1.5% for rabi food crops.',25000,'https://pmfby.gov.in','[{"rule":"Growing a notified crop in a notified area","passed":true},{"rule":"Sowing certificate available","passed":true},{"rule":"Enrolment before cut-off date","passed":true}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook","Sowing Certificate"}'),
('PM-KUSUM Solar Pump Subsidy','Solar & Energy','likely','Up to 10 ha','Up to 60% subsidy on standalone solar agriculture pumps plus 30% bank loan support for grid-connected farms.',180000,'https://pmkusum.mnre.gov.in','[{"rule":"Owns agricultural land with irrigation need","passed":true},{"rule":"Existing diesel pump or no grid connection","passed":true},{"rule":"State nodal agency quota available","passed":false}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook","Electricity Bill"}'),
('Kisan Credit Card (KCC)','Credit','eligible','No limit','Short-term crop loan up to Rs 3 lakh at 4% effective interest with timely repayment incentive.',300000,'https://www.myscheme.gov.in/schemes/kcc','[{"rule":"Cultivator, owner or tenant farmer","passed":true},{"rule":"No wilful loan default","passed":true},{"rule":"Valid KYC documents","passed":true}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook","Passport Photo"}'),
('Soil Health Card Scheme','Advisory','eligible','No limit','Free soil testing every two years with crop-wise nutrient and fertiliser recommendations.',1500,'https://soilhealth.dac.gov.in','[{"rule":"Owns or cultivates farmland","passed":true},{"rule":"Sample collected by field officer","passed":true}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)"}'),
('Per Drop More Crop (PMKSY Micro Irrigation)','Irrigation','likely','Up to 5 ha','Subsidy of 55% for small & marginal farmers on drip and sprinkler irrigation systems.',95000,'https://pmksy.gov.in','[{"rule":"Small & marginal category","passed":true},{"rule":"Assured water source on farm","passed":false},{"rule":"No micro-irrigation subsidy in last 7 years","passed":true}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook","Water Source Certificate"}'),
('Agriculture Infrastructure Fund','Infrastructure','potential','No limit','Loans up to Rs 2 crore for post-harvest storage with 3% interest subvention for 7 years.',2000000,'https://agriinfra.dac.gov.in','[{"rule":"Individual farmer, FPO or SHG","passed":true},{"rule":"Viable project report submitted","passed":false},{"rule":"Bank sanction obtained","passed":false}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook","Project Report"}'),
('National Mission on Natural Farming','Sustainability','potential','Up to 2 ha','Assistance of Rs 15,000 per hectare over 3 years for shifting to chemical-free natural farming.',45000,'https://naturalfarming.dac.gov.in','[{"rule":"Willing to adopt natural farming cluster","passed":true},{"rule":"Cluster of 50 acres formed in village","passed":false}]','{"Aadhaar Card","Land Records (Khasra/Khatauni)","Bank Passbook"}');