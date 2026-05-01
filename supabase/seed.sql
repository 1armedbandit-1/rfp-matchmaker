-- Seed data for Real Fight Matchmaker

-- Helper to get or create auth users (run manually via Supabase CLI)
-- For development, these UUIDs represent users that would be created via sign-up

-- Users table seed (15 total users across roles)
-- 5 fighters, 3 trainers, 2 managers, 2 promoters, 1 matchmaker, 2 providers

INSERT INTO public.users (
  id, display_name, profile_photo_url, primary_role, secondary_roles,
  city, state_region, country, short_bio, preferred_contact_method,
  preferred_contact_value, is_profile_complete, created_at
) VALUES

-- Fighter 1: Marcus "The Storm" Johnson (California)
('550e8400-e29b-41d4-a716-446655440001', 'Marcus Johnson', NULL, 'fighter', '{}',
 'Los Angeles', 'California', 'USA',
 'Professional welterweight boxer with 12 pro fights. Looking to build my record and secure sponsorship deals. Based at Kings Boxing Club.',
 'instagram', '@storm_boxing', true, now() - interval '90 days'),

-- Fighter 2: Jessica Chen (Texas)
('550e8400-e29b-41d4-a716-446655440002', 'Jessica Chen', NULL, 'fighter', '{}',
 'Austin', 'Texas', 'USA',
 'MMA fighter, 135lb weight class. 8-3 amateur record, turning pro next month. Looking for a good manager and training partners.',
 'email', 'jessica.chen.mma@email.com', true, now() - interval '75 days'),

-- Fighter 3: Tommy "Iron Fists" Rodriguez (New York)
('550e8400-e29b-41d4-a716-446655440003', 'Tommy Rodriguez', NULL, 'fighter', '{}',
 'Brooklyn', 'New York', 'USA',
 'Light heavyweight boxer. Pro record 15-2-1, 8 KOs. Looking for fights and coaching expertise in cardio conditioning.',
 'phone', '(718) 555-0123', true, now() - interval '60 days'),

-- Fighter 4: David Okafor (Florida)
('550e8400-e29b-41d4-a716-446655440004', 'David Okafor', NULL, 'fighter', '{}',
 'Miami', 'Florida', 'USA',
 'Amateur heavyweight kickboxer, competing in K-1 style events. 6-1 record. Seeking gym partnerships and co-trainers.',
 'whatsapp', '+1-786-555-0456', true, now() - interval '45 days'),

-- Fighter 5: Sarah Mitchell (Colorado)
('550e8400-e29b-41d4-a716-446655440005', 'Sarah Mitchell', NULL, 'fighter', '{}',
 'Denver', 'Colorado', 'USA',
 'BJJ competitor and MMA fighter. Blue belt with fighting record 3-1. Looking for sparring partners and nutrition coaching.',
 'email', 'sarah.mitchell.fight@email.com', true, now() - interval '30 days'),

-- Trainer 1: Coach James Patterson (California)
('550e8400-e29b-41d4-a716-446655440006', 'James Patterson', NULL, 'trainer', '{}',
 'Los Angeles', 'California', 'USA',
 'Head coach at Kings Boxing Club since 2010. Specialized in heavy bag technique and ring strategy for pros and amateurs.',
 'email', 'james@kingsboxing.com', true, now() - interval '120 days'),

-- Trainer 2: Elena Vasquez (Texas)
('550e8400-e29b-41d4-a716-446655440007', 'Elena Vasquez', NULL, 'trainer', '{}',
 'Dallas', 'Texas', 'USA',
 'MMA Head Coach at Velocity Fight Team. 12 years experience training fighters across all disciplines. Currently accepting 2 new fighters.',
 'phone', '(972) 555-0789', true, now() - interval '100 days'),

-- Trainer 3: Coach Bryan Lee (Nevada)
('550e8400-e29b-41d4-a716-446655440008', 'Bryan Lee', NULL, 'trainer', '{}',
 'Las Vegas', 'Nevada', 'USA',
 'Boxing & conditioning specialist. Worked with regional and national champions. Looking to mentor assistant coaches and develop boxing programs.',
 'signal', '+1-702-555-0321', true, now() - interval '80 days'),

-- Manager 1: Vincent Kross (New York)
('550e8400-e29b-41d4-a716-446655440009', 'Vincent Kross', NULL, 'manager', '{}',
 'New York', 'New York', 'USA',
 'Fight management & promotions. Currently managing 4 professional fighters in boxing and MMA. Looking for partnership opportunities with co-managers.',
 'email', 'vincent@krossmgmt.com', true, now() - interval '150 days'),

-- Manager 2: Alex Stone (California)
('550e8400-e29b-41d4-a716-446655440010', 'Alex Stone', NULL, 'manager', '{}',
 'San Francisco', 'California', 'USA',
 'Sports management agency focused on combat sports. Roster of 6 fighters. Seeking sponsorship relationships and sanctioning body contacts.',
 'phone', '(415) 555-0654', true, now() - interval '110 days'),

-- Promoter 1: Robert Martinez (Texas)
('550e8400-e29b-41d4-a716-446655440011', 'Robert Martinez', NULL, 'promoter', '{}',
 'Houston', 'Texas', 'USA',
 'Boxing promoter, 8 events per year sanctioned by WBC. Looking for matchmakers and venues for summer 2026 fight cards.',
 'email', 'robert@texasboxing.net', true, now() - interval '140 days'),

-- Promoter 2: Jennifer Walsh (Pennsylvania)
('550e8400-e29b-41d4-a716-446655440012', 'Jennifer Walsh', NULL, 'promoter', '{}',
 'Philadelphia', 'Pennsylvania', 'USA',
 'MMA event promoter, IBJJF sanctioned. 6 events annually. Seeking fighter relationships and sponsorship partnerships.',
 'phone', '(267) 555-0987', true, now() - interval '95 days'),

-- Matchmaker: Anthony DeMarco (Nevada)
('550e8400-e29b-41d4-a716-446655440013', 'Anthony DeMarco', NULL, 'matchmaker', '{}',
 'Las Vegas', 'Nevada', 'USA',
 'Professional matchmaker with 15 years experience. Worked with Golden Boy, Top Rank, and PBC. Specializing in title-level boxing matches.',
 'email', 'anthony.demarco@matchmaking.com', true, now() - interval '200 days'),

-- Provider 1: Marcus "Cutman" Williams (New York)
('550e8400-e29b-41d4-a716-446655440014', 'Marcus Williams', NULL, 'provider', '{}',
 'Manhattan', 'New York', 'USA',
 'Certified cutman & cornerman. 20 years ringside experience. Available for fight night coverage across the Northeast.',
 'phone', '(212) 555-0159', true, now() - interval '85 days'),

-- Provider 2: Dr. Lisa Chen (California)
('550e8400-e29b-41d4-a716-446655440015', 'Dr. Lisa Chen', NULL, 'provider', '{}',
 'San Diego', 'California', 'USA',
 'Sports nutritionist & performance coach. Specializing in combat athletes. Available for consultation and meal plan design.',
 'email', 'dr.lisa.chen@nutrition.com', true, now() - interval '70 days');


-- Fighter profiles (5)
INSERT INTO public.fighter_profiles (
  user_id, discipline, status, am_or_pro, weight_lbs, weight_class,
  record_pro_w, record_pro_l, record_pro_d, record_pro_kos,
  record_am_w, record_am_l, record_am_d,
  boxrec_url, gym_affiliation, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440001', '{"boxing"}', 'active', 'professional', 147, 'welterweight',
 12, 2, 0, 6, 18, 3, 1,
 'https://boxrec.com/en/boxer/1234567', 'Kings Boxing Club',
 '{"fights","sponsorship","promoter"}'),

('550e8400-e29b-41d4-a716-446655440002', '{"mma"}', 'active', 'amateur', 135, 'featherweight',
 0, 0, 0, 0, 8, 3, 0,
 NULL, 'Velocity Fight Team',
 '{"fights","manager","trainer","sparring_partners"}'),

('550e8400-e29b-41d4-a716-446655440003', '{"boxing"}', 'active', 'professional', 175, 'light_heavyweight',
 15, 2, 1, 8, 12, 2, 0,
 'https://boxrec.com/en/boxer/2345678', 'LHW Elite Boxing',
 '{"fights","trainer","nutrition"}'),

('550e8400-e29b-41d4-a716-446655440004', '{"kickboxing"}', 'active', 'amateur', 265, 'heavyweight',
 6, 1, 0, 3, NULL, NULL, NULL,
 NULL, 'South Florida Kickboxing',
 '{"gym_partnerships","assistant_coaches","training_partners"}'),

('550e8400-e29b-41d4-a716-446655440005', '{"mma","bjj"}', 'active', 'amateur', 155, 'lightweight',
 0, 0, 0, 0, 3, 1, 0,
 NULL, 'Denver MMA Collective',
 '{"sparring_partners","nutrition","sports_medicine"}');


-- Trainer profiles (3)
INSERT INTO public.trainer_profiles (
  user_id, gym_name, gym_address, disciplines,
  specialties, years_experience, accepting_new_fighters, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440006', 'Kings Boxing Club', '2847 Sunset Blvd, Los Angeles, CA',
 '{"boxing"}', 'Heavy bag work, ring generalship, pro strategy', 18, true,
 '{"assistant_coaches","fighter_management"}'),

('550e8400-e29b-41d4-a716-446655440007', 'Velocity Fight Team', '4521 McKinney Ave, Dallas, TX',
 '{"mma","kickboxing"}', 'Strength & conditioning, wrestling, takedown defense', 12, true,
 '{"co_managers","sponsorship","partnerships"}'),

('550e8400-e29b-41d4-a716-446655440008', 'Las Vegas Boxing Academy', '1450 North Decatur Blvd, Las Vegas, NV',
 '{"boxing"}', 'Amateur development, conditioning programs', 16, false,
 '{"assistant_coaches","gym_partnerships"}');


-- Manager profiles (2)
INSERT INTO public.manager_profiles (
  user_id, company_name, current_roster_size, disciplines, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440009', 'Kross Management Group', 4, '{"boxing","mma"}',
 '{"co_managers","promoter_relationships","sponsorship"}'),

('550e8400-e29b-41d4-a716-446655440010', 'Stone Sports Management', 6, '{"boxing","mma","kickboxing"}',
 '{"fighters","sponsors","promoter_relationships","media"}');


-- Promoter profiles (2)
INSERT INTO public.promoter_profiles (
  user_id, organization_name, events_per_year, sanctioning_bodies, disciplines, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440011', 'Texas Boxing Promotions', 8, '{"WBC","IBF"}', '{"boxing"}',
 '{"matchmakers","fighters","venues","sponsorship"}'),

('550e8400-e29b-41d4-a716-446655440012', 'Philly MMA Events', 6, '{"IBJJF","NMMA"}', '{"mma","bjj"}',
 '{"fighters","venues","sanctioning_bodies","media"}');


-- Matchmaker profile (1)
INSERT INTO public.matchmaker_profiles (
  user_id, organizations_worked_with, disciplines, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440013', '{"Golden Boy Promotions","Top Rank","Premier Boxing Champions"}',
 '{"boxing"}', '{"promoters","fighters"}');


-- Provider profiles (2)
INSERT INTO public.provider_profiles (
  user_id, service_type, credentials, service_area_radius_miles, looking_for
) VALUES

('550e8400-e29b-41d4-a716-446655440014', 'cutman', 'Certified cornerman, 20+ years ringside', 200,
 '{"fighters","managers","promoters"}'),

('550e8400-e29b-41d4-a716-446655440015', 'nutrition', 'MS Nutrition, ISSN-SNS Specialist', 50,
 '{"fighters","trainers","gyms"}');


-- Posts feed (5 realistic posts)
INSERT INTO public.posts (id, user_id, body, media_url, created_at) VALUES

-- Marcus Johnson post
('a00e8400-e29b-41d4-a716-446655440101',
 '550e8400-e29b-41d4-a716-446655440001',
 'Just wrapped a brutal 8-round session with Coach James. Feeling sharp going into next month. Who has upcoming fights in the welterweight division in SoCal? Looking to negotiate some matchups.',
 NULL,
 now() - interval '3 days'),

-- Elena Vasquez post
('a00e8400-e29b-41d4-a716-446655440102',
 '550e8400-e29b-41d4-a716-446655440007',
 'Velocity Fight Team is hosting a wrestling camp this summer! All levels welcome. First 10 to sign up get 20% off. DM for details.',
 NULL,
 now() - interval '2 days'),

-- Tommy Rodriguez post
('a00e8400-e29b-41d4-a716-446655440103',
 '550e8400-e29b-41d4-a716-446655440003',
 'Looking for a sports nutritionist to help optimize my diet for the next training camp. Anyone have recommendations in NYC area? Budget-friendly preferred.',
 NULL,
 now() - interval '1 day'),

-- Robert Martinez post
('a00e8400-e29b-41d4-a716-446655440104',
 '550e8400-e29b-41d4-a716-446655440011',
 'Texas Boxing Promotions is seeking fresh talent for our August card. 4 title fights already secured. Interested promoter/manager collaborations welcome!',
 NULL,
 now() - interval '12 hours'),

-- Sarah Mitchell post
('a00e8400-e29b-41d4-a716-446655440105',
 '550e8400-e29b-41d4-a716-446655440005',
 'Just earned my blue belt in BJJ! Ready to step up my competition game. Anyone in Denver interested in regular sparring sessions?',
 NULL,
 now() - interval '6 hours');


-- Post likes (add engagement)
INSERT INTO public.post_likes (post_id, user_id, created_at) VALUES

('a00e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440006', now() - interval '2 days 12 hours'),
('a00e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440009', now() - interval '2 days 8 hours'),
('a00e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', now() - interval '1 day 20 hours'),
('a00e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440004', now() - interval '1 day 15 hours'),
('a00e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440005', now() - interval '1 day 10 hours'),
('a00e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440015', now() - interval '20 hours'),
('a00e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440001', now() - interval '10 hours'),
('a00e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440010', now() - interval '8 hours'),
('a00e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440002', now() - interval '4 hours'),
('a00e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440007', now() - interval '2 hours');
