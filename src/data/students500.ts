import type { ChannelSource, StudentRegistration } from '../types';

const FIRST_NAMES = [
  'Karthikeya', 'Aishwarya', 'Revanth', 'Divya', 'Siddharth', 'Bhavya', 'Varun', 'Keerthana',
  'Sai Pranav', 'Harini', 'Nikhil', 'Sneha', 'Manoj', 'Ananya', 'Rohith', 'Priya',
  'Vikram', 'Shreya', 'Abhinav', 'Kavya', 'Tarun', 'Deepika', 'Aditya', 'Meghana',
  'Gautham', 'Sravani', 'Praneeth', 'Harsha', 'Niharika', 'Charan', 'Tejaswini', 'Pawan',
  'Swathi', 'Sanjay', 'Manasa', 'Vamsi', 'Pooja', 'Rishi', 'Aparna', 'Akhil',
  'Lahari', 'Surya', 'Rhea', 'Kalyan', 'Pavani', 'Chaitanya', 'Monika', 'Lokesh',
  'Sanjana', 'Madhav', 'Sandhya', 'Kiran', 'Archana', 'Naveen', 'Sindhu', 'Vijay',
  'Amulya', 'Dinesh', 'Shruti', 'Raghav', 'Bindu', 'Bharath', 'Tanvi', 'Sumanth',
  'Gayatri', 'Avinash', 'Sahithi', 'Vishal', 'Preethi', 'Koushik', 'Anusha', 'Deepak',
  'Chandana', 'Satish', 'Varsha', 'Anil', 'Suhasini', 'Santosh', 'Sireesha', 'Sunil',
  'Bhavani', 'Arjun', 'Pratyusha', 'Rahul', 'Jyothi', 'Rajesh', 'Neelima', 'Praveen',
  'Kusuma', 'Mahesh', 'Spandana', 'Venkatesh', 'Alekya', 'Srinivas', 'Pranitha', 'Ganesh',
  'Madhuri', 'Krishna', 'Tejaswi', 'Phani', 'Sujatha', 'Harish', 'Sirisha', 'Ramesh',
];

const LAST_NAMES = [
  'Reddy', 'Deshmukh', 'Kumar', 'Sree', 'Rao', 'Reddy B.', 'Kulkarni', 'Nair',
  'Chowdary', 'Sharma', 'Goud', 'Varma', 'Teja', 'Prasad', 'Gupta', 'Patel',
  'Verma', 'Naidu', 'Raju', 'Babu', 'Mishra', 'Joshi', 'Bhat', 'Menon',
  'Pillai', 'Shetty', 'Hegde', 'Gowda', 'Nambiar', 'Bose', 'Sen', 'Dutta',
  'Kamireddy', 'Bolisetti', 'Kandula', 'Mekala', 'Chilukuri', 'Vaddi', 'Gollapudi', 'Yarlagadda',
  'Bandaru', 'Challa', 'Gudipati', 'Kaza', 'Kondapalli', 'Mamidipalli', 'Pendyala', 'Surapaneni',
  'Thota', 'Uppalapati', 'Vemuri', 'Yerramsetti', 'Bandi', 'Chegondi', 'Dantuluri', 'Gadiraju',
  'Indukuri', 'Jampana', 'Kanumuri', 'Mudunuri', 'Nallaparaju', 'Penmetsa', 'Rudraraju', 'Sagi',
];

const COLLEGES_DATA: { name: string; domain: string; defaultCode: string; channel: ChannelSource }[] = [
  { name: 'SRM University AP', domain: 'srmap.edu.in', defaultCode: 'CR-SRMAP-01', channel: 'CR WhatsApp Group' },
  { name: 'VNR VJIET Hyderabad', domain: 'vnrvjiet.in', defaultCode: 'CLUB-VNR-02', channel: 'Coding Club Sprint' },
  { name: 'JNTU Hyderabad', domain: 'jntuh.ac.in', defaultCode: 'CR-JNTUH-03', channel: 'CR WhatsApp Group' },
  { name: 'VIT Vellore', domain: 'vitstudent.ac.in', defaultCode: 'CLUB-VIT-04', channel: 'Coding Club Sprint' },
  { name: 'GRIET Hyderabad', domain: 'griet.ac.in', defaultCode: 'CR-GRIET-05', channel: 'CR WhatsApp Group' },
  { name: 'CVR College of Engineering', domain: 'cvr.ac.in', defaultCode: 'TPO-CVR-06', channel: 'CR WhatsApp Group' },
  { name: 'GITAM Visakhapatnam', domain: 'gitam.in', defaultCode: 'CR-GITAM-07', channel: 'CR WhatsApp Group' },
  { name: 'Vasavi College of Engineering', domain: 'vasavi.ac.in', defaultCode: 'CR-VASAVI-08', channel: 'CR WhatsApp Group' },
  { name: 'CBIT Hyderabad', domain: 'cbit.ac.in', defaultCode: 'CLUB-CBIT-09', channel: 'Coding Club Sprint' },
  { name: 'BVRIT Hyderabad', domain: 'bvrit.ac.in', defaultCode: 'CR-BVRIT-10', channel: 'CR WhatsApp Group' },
];

const BRANCHES = [
  'CSE',
  'CSE (AI & ML)',
  'IT',
  'CSE (Data Science)',
  'ECE',
  'EEE',
];

const TARGET_ROLES = [
  'TCS Prime / SDE (GenAI)',
  'Infosys Specialist Programmer',
  'Accenture GenAI Specialist',
  'Zoho Member Technical Staff',
  'Cognizant GenC Next SDE',
  'Capgemini Exceller SDE',
  'Product Startup AI Engineer',
];

const PROJECT_TRACKS = [
  'HireLens 60 — Placement JD-to-Resume Gap Analyzer',
  'ClaimVerify 60 — Hallucination-Guarded Document Q&A API',
  'FaultSense 60 — Telemetry & Sensor Anomaly Triage Microservice',
  'SQL-Guard 60 — Natural Language to Safe Analytics API',
  'TicketRouter AI — Support Triage + SLA JSON Classifier',
  'MockViva 60 — Placement Resume Cross-Examiner Engine',
];

/**
 * Generates exactly 500 final-year B.Tech students strictly aligned to the 500 target model:
 * - 235 students from CR WhatsApp Groups (47%)
 * - 165 students from Peer Squad Referrals (33%)
 * - 100 students from Coding Club Sprints (20%)
 * Total: 235 + 165 + 100 = 500
 */
export function generate500Students(): StudentRegistration[] {
  const students: StudentRegistration[] = [];
  const targetCount = 500;

  for (let i = 0; i < targetCount; i++) {
    const fIndex = (i * 7 + 13) % FIRST_NAMES.length;
    const lIndex = (i * 11 + 29) % LAST_NAMES.length;
    const colIndex = i % COLLEGES_DATA.length;
    const branchIndex = (i * 3 + 1) % BRANCHES.length;
    const roleIndex = (i * 5 + 2) % TARGET_ROLES.length;
    const trackIndex = (i * 4 + 3) % PROJECT_TRACKS.length;

    const firstName = FIRST_NAMES[fIndex];
    const lastName = LAST_NAMES[lIndex];
    const fullName = `${firstName} ${lastName}`;
    const col = COLLEGES_DATA[colIndex];
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4)}${i + 1}`;
    const email = `${emailPrefix}@${col.domain}`;

    // Realistic verified phone numbers starting with standard telecom circles
    const phonePrefixes = ['98480', '94401', '91772', '97012', '99890', '96182', '98850', '94910'];
    const pPrefix = phonePrefixes[i % phonePrefixes.length];
    const pSuffix = String(10000 + ((i * 12347) % 89999)).slice(0, 5);
    const phone = `+91 ${pPrefix} ${pSuffix}`;

    // Clean personal squad code
    const ownCode = `SQ-${firstName.toUpperCase().slice(0, 6)}-${String(10 + (i % 89))}`;

    // Strict 235 + 165 + 100 = 500 Channel Target Distribution
    let channel: ChannelSource;
    let referredByCode: string | null;

    if (i < 235) {
      // 235 from Class Representative Official WhatsApp Groups
      channel = 'CR WhatsApp Group';
      referredByCode = col.defaultCode;
    } else if (i < 400) {
      // 165 from Peer Squad Referrals (235 + 165 = 400)
      channel = 'Peer Squad Referral';
      const peerIdx = (i * 3 + 7) % 235; // referred by an earlier registrant
      referredByCode = `SQ-${FIRST_NAMES[peerIdx % FIRST_NAMES.length].toUpperCase().slice(0, 6)}-${10 + (peerIdx % 89)}`;
    } else {
      // 100 from College Coding Club Co-Hosted Sprints (400 + 100 = 500)
      channel = 'Coding Club Sprint';
      const clubCodes = ['CLUB-VNR-02', 'CLUB-VIT-04', 'CLUB-CBIT-09'];
      referredByCode = clubCodes[i % clubCodes.length];
    }

    // Squad status & referrals converted
    let referralsConverted = 0;
    let squadStatus: StudentRegistration['squadStatus'] = 'Seat Reserved (0/2)';
    if (i % 3 === 0) {
      referralsConverted = 2;
      squadStatus = 'Full Squad + Evaluator Unlocked (2/2)';
    } else if (i % 2 === 0) {
      referralsConverted = 1;
      squadStatus = 'Starter Repo Unlocked (1/2)';
    }

    // Exact 7-Day Sprint Distribution: 35 + 75 + 90 + 85 + 80 + 75 + 60 = 500
    let dayNum = 1;
    if (i < 35) dayNum = 1;
    else if (i < 110) dayNum = 2;
    else if (i < 200) dayNum = 3;
    else if (i < 285) dayNum = 4;
    else if (i < 365) dayNum = 5;
    else if (i < 440) dayNum = 6;
    else dayNum = 7;

    const hour = 10 + (i % 12);
    const min = String((i * 7) % 60).padStart(2, '0');

    students.push({
      id: `reg-${1001 + i}`,
      fullName,
      email,
      phone,
      college: col.name,
      branch: BRANCHES[branchIndex],
      gradYear: '2027',
      targetRole: TARGET_ROLES[roleIndex],
      projectTrack: PROJECT_TRACKS[trackIndex],
      channel,
      referredByCode,
      ownReferralCode: ownCode,
      referralClicks: referralsConverted * 3 + (i % 4),
      referralsConverted,
      squadStatus,
      cohortType: 'Simulated Baseline',
      registeredAt: `Day ${dayNum} · ${hour}:${min} IST`,
    });
  }

  return students;
}
