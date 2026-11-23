import { stock } from "@/services/mock/fixtures/images";
import type { Treatment } from "@/types/content";

/**
 * Treatment / technology library. Original copy written for Femur (not copied from any other site).
 * CLINICAL REVIEW REQUIRED before launch: confirm which treatments Femur actually offers, session lengths and
 * course sizes, and the contraindication wording. Items marked availability "confirm" are shown with a
 * "confirmed when you book" label until the clinic signs them off.
 */
export const treatments: Treatment[] = [
  {
    slug: "shockwave-therapy",
    name: "Shockwave Therapy",
    bn: "শকওয়েভ থেরাপি",
    family: "Device-based",
    summary: "Focused acoustic pulses applied to stubborn tendon and heel pain, with no needles and no downtime.",
    bnSummary: "সূঁচ ছাড়াই জমে থাকা টেন্ডন ও গোড়ালির ব্যথার জন্য শব্দতরঙ্গ-ভিত্তিক থেরাপি।",
    image: stock.kneeExercise,
    overview:
      "Extracorporeal shockwave therapy (ESWT) sends short acoustic pulses through a hand-held applicator into a sore area of tendon or soft tissue. It is most often used for long-standing problems that have not settled with rest and exercise alone, and is usually combined with a strengthening programme so the benefit lasts.",
    howItWorks:
      "The pulses are thought to stimulate circulation and the body's own repair response in the treated tissue, and to calm irritated nerve endings. Your physiotherapist finds the tender spot, applies gel and moves the applicator over it while you tell us how the pressure feels.",
    sessionLength: "About 10–15 minutes of treatment time",
    typicalCourse: "Often a short course of weekly sessions, reviewed after the first few visits",
    sensation: "A tapping pressure that can feel uncomfortable over a sore spot. We adjust the intensity to what you can tolerate.",
    goodFor: ["Heel pain and plantar fasciitis", "Tennis and golfer's elbow", "Calcific or irritable shoulder tendons", "Long-standing knee and hip tendon pain"],
    tellUsFirst: ["You are pregnant", "You have a bleeding disorder or take blood thinners", "You have an implanted pacemaker", "The area has an infection, tumour or open wound", "You have had a steroid injection there recently"],
    conditionSlugs: ["ankle-heel-pain", "elbow-pain", "shoulder-pain", "knee-pain"],
    serviceSlug: "pain-management",
    availability: "confirm",
    faqs: [
      { q: "Does shockwave therapy hurt?", a: "It is usually described as uncomfortable rather than painful, and it only lasts a few minutes. The intensity is turned up gradually and we can stop or reduce it at any time." },
      { q: "How many sessions will I need?", a: "It depends on the problem and how long you have had it. We plan a short course, check your response early and only continue if it is helping." },
      { q: "Can I walk and work afterwards?", a: "Yes, most people go straight back to normal activity. We may ask you to avoid hard impact exercise for a day or two." },
    ],
  },
  {
    slug: "pemf-therapy",
    name: "PEMF Therapy",
    bn: "পিইএমএফ থেরাপি",
    family: "Device-based",
    summary: "Gentle pulsed magnetic fields used alongside exercise to ease aching joints, back pain and stiffness.",
    bnSummary: "ব্যায়ামের সঙ্গে ব্যবহৃত মৃদু চৌম্বক-ক্ষেত্র থেরাপি, জয়েন্ট ও পিঠের ব্যথায় সহায়ক।",
    image: stock.rehabClinic,
    overview:
      "Pulsed electromagnetic field (PEMF) therapy uses a padded applicator or mat that delivers low-intensity magnetic pulses through clothing. It is a passive, relaxing treatment that we use as a supporting tool, never as a substitute for movement and strengthening.",
    howItWorks:
      "Low-frequency pulses pass through the tissues under the applicator. They are used to help settle pain and stiffness so that you can move and exercise more comfortably.",
    sessionLength: "20–30 minutes",
    typicalCourse: "Usually a series of sessions over a few weeks, combined with physiotherapy",
    sensation: "Most people feel little or a mild tingling or warmth. You can lie back and rest.",
    goodFor: ["Knee and hip osteoarthritis pain", "Chronic low back and neck pain", "Muscle aching and stiffness", "Support during rehabilitation"],
    tellUsFirst: ["You have a pacemaker or other implanted electronic device", "You are pregnant", "You have a serious heart condition", "You have an active infection or cancer"],
    conditionSlugs: ["low-back-pain", "neck-pain", "joint-pain-arthritis", "shoulder-pain", "leg-pain-sciatica"],
    serviceSlug: "pain-management",
    availability: "confirm",
    faqs: [
      { q: "Is PEMF therapy painful?", a: "No. It is a comfortable, passive treatment. You may feel a light tingling or warmth, or nothing at all." },
      { q: "Can I have PEMF on its own?", a: "We recommend using it together with a physiotherapy and exercise plan. On its own it is unlikely to fix the underlying cause." },
      { q: "Who should not have PEMF?", a: "People with pacemakers or implanted electronic devices, and anyone who is pregnant, should speak to us before treatment." },
    ],
  },
  {
    slug: "acupuncture-therapy",
    name: "Acupuncture & Electro-acupuncture",
    bn: "আকুপাংচার ও ইলেক্ট্রো-আকুপাংচার",
    family: "Needle-based",
    summary: "Very fine, single-use needles placed at selected points, with or without a mild electrical pulse, to reduce muscle pain and tension.",
    bnSummary: "নির্বাচিত পয়েন্টে অতি সরু, একবার-ব্যবহারযোগ্য সূঁচ, প্রয়োজনে মৃদু বিদ্যুৎ-স্পন্দনসহ।",
    image: stock.acupuncture,
    overview:
      "Acupuncture places very fine, sterile, single-use needles into the skin and muscle at chosen points. In electro-acupuncture, a small device passes a gentle pulse between pairs of needles. Used by a trained practitioner, it can be a helpful option for muscular pain and tension alongside hands-on care and exercise.",
    howItWorks:
      "Needling is thought to relax tight muscle, change how pain signals are processed and release natural pain-relieving chemicals. Evidence is stronger for some complaints, such as chronic low back, neck and knee pain, than for others, and we will be honest about that at your assessment.",
    sessionLength: "20–30 minutes",
    typicalCourse: "Often several sessions over a few weeks, with a review after the first few",
    sensation: "A brief pinch, then a dull ache, warmth or heaviness around the needle. With electro-acupuncture, a rhythmic tapping that you control.",
    goodFor: ["Chronic low back and neck pain", "Shoulder and knee pain", "Tension-type headache", "Muscle spasm and trigger points"],
    tellUsFirst: ["You are pregnant", "You have a bleeding disorder or take blood thinners", "You have a pacemaker (for electro-acupuncture)", "You have very low blood pressure or faint easily", "You have a skin infection near the area"],
    conditionSlugs: ["low-back-pain", "neck-pain", "knee-pain", "shoulder-pain", "migraine-headache", "joint-pain-arthritis"],
    serviceSlug: "pain-management",
    availability: "core",
    faqs: [
      { q: "Is acupuncture painful?", a: "Most people feel a brief pinch or nothing at all when the needle goes in, followed by a dull ache or warmth. Tell us if anything feels sharp and we will adjust." },
      { q: "Are the needles safe?", a: "We use sterile, single-use needles only, and they are disposed of safely after each session. As with any treatment, minor bruising or soreness can occur." },
      { q: "How many sessions are usual?", a: "Many people notice a change within the first few sessions. If you have not, we will review the plan rather than carry on regardless." },
    ],
  },
  {
    slug: "manual-therapy",
    name: "Manual Therapy",
    bn: "ম্যানুয়াল থেরাপি",
    family: "Hands-on",
    summary: "Skilled hands-on joint and soft-tissue techniques that restore movement and make exercise easier.",
    bnSummary: "দক্ষ হাতের কৌশলে জয়েন্ট ও পেশির নড়াচড়া ফিরিয়ে আনা।",
    image: stock.manualTherapy,
    overview:
      "Manual therapy is the foundation of our physiotherapy. Your physiotherapist uses graded joint mobilisation, soft-tissue release and gentle stretching to reduce pain and stiffness, then builds on that window of comfort with exercise and advice.",
    howItWorks:
      "Hands-on techniques temporarily reduce pain and improve joint and muscle movement. That makes it easier to do the strengthening and movement retraining that give lasting results.",
    sessionLength: "30–45 minutes, including assessment and exercise",
    typicalCourse: "A programme planned at your first visit and reviewed as you improve",
    sensation: "Firm but comfortable pressure and movement. Tell us at any point if you want us to ease off.",
    goodFor: ["Back and neck stiffness", "Frozen shoulder and joint stiffness", "Muscle tightness and tension", "Recovery after injury or surgery"],
    tellUsFirst: ["You have had recent fractures or surgery", "You have osteoporosis", "You have numbness, weakness or unexplained weight loss"],
    conditionSlugs: ["low-back-pain", "neck-pain", "shoulder-pain", "knee-pain", "elbow-pain", "migraine-headache", "joint-pain-arthritis", "ankle-heel-pain"],
    serviceSlug: "physiotherapy",
    availability: "core",
    faqs: [
      { q: "Will manual therapy cure my pain by itself?", a: "It usually works best as part of a plan. Hands-on work helps you move better now; exercise and habit changes help it stay better." },
      { q: "Is the treatment done by someone of my gender?", a: "Yes. Femur offers same-gender physiotherapists for physiotherapy sessions." },
    ],
  },
  {
    slug: "cryotherapy",
    name: "Cryotherapy",
    bn: "ক্রায়োথেরাপি",
    family: "Cold therapy",
    summary: "Controlled cold applied to calm sore, swollen tissue in the early or flared-up stage.",
    bnSummary: "ফোলা ও ব্যথাযুক্ত স্থানে নিয়ন্ত্রিত ঠান্ডা প্রয়োগ।",
    image: stock.sports,
    overview:
      "Cryotherapy uses controlled cold, through cold packs or a cold-air device, to ease pain and swelling over a sore area. It is a short, simple treatment that we use to help you tolerate movement and exercise, particularly after a flare-up or an injury.",
    howItWorks:
      "Cold reduces local blood flow and dulls pain signals for a while, which can make a swollen or irritated joint or muscle more comfortable.",
    sessionLength: "Usually 5–15 minutes, depending on the method",
    typicalCourse: "Used as needed within a wider treatment plan",
    sensation: "Cold, then numbness in the area. It should never burn or hurt; tell us if it does.",
    goodFor: ["Acute sprains and strains", "Flare-ups of joint pain", "Post-exercise soreness", "Swelling after injury"],
    tellUsFirst: ["You have poor circulation or Raynaud's", "You have reduced skin sensation, for example with diabetes", "You are sensitive to cold"],
    conditionSlugs: ["knee-pain", "ankle-heel-pain", "joint-pain-arthritis", "elbow-pain"],
    serviceSlug: "sports-injury-rehabilitation",
    availability: "confirm",
    faqs: [
      { q: "When is cold better than heat?", a: "Cold is generally preferred for new injuries and swelling; heat can suit stiff, aching muscles. We will advise which is right for you." },
    ],
  },
  {
    slug: "rtms-therapy",
    name: "rTMS for Migraine & Nerve Pain",
    bn: "আরটিএমএস থেরাপি",
    family: "Brain stimulation",
    summary: "Non-invasive magnetic stimulation used for selected cases of migraine and nerve-related pain, under clinical supervision.",
    bnSummary: "নির্বাচিত মাইগ্রেন ও স্নায়ুজনিত ব্যথায় চিকিৎসকের তত্ত্বাবধানে অস্ত্রোপচারবিহীন চৌম্বক উদ্দীপনা।",
    image: stock.neuro,
    overview:
      "Repetitive transcranial magnetic stimulation (rTMS) uses a magnetic coil held against the scalp to stimulate specific brain regions. It is used in selected people with long-standing migraine or nerve-related pain. Suitability needs a medical screening first, and it is delivered alongside, not instead of, standard headache care.",
    howItWorks:
      "Short magnetic pulses painlessly pass through the skull and change activity in the targeted area of the brain. The aim is to reduce how often or how severe the headaches are over a course of sessions.",
    sessionLength: "Around 20–40 minutes per session including set-up",
    typicalCourse: "A planned course of sessions over several weeks, decided after screening",
    sensation: "A tapping sound and a light tapping feeling on the scalp. Some people notice a mild headache afterwards.",
    goodFor: ["Frequent migraine that has not responded well to usual care", "Selected nerve-related pain, after medical review"],
    tellUsFirst: ["You have epilepsy or have had seizures", "You have metal implants in or near the head, or a pacemaker", "You are pregnant", "You have a new or changing headache pattern"],
    conditionSlugs: ["migraine-headache"],
    serviceSlug: "neurological-rehabilitation",
    availability: "confirm",
    faqs: [
      { q: "Is rTMS safe?", a: "It is generally well tolerated when screening is done properly, which is why we assess your history first. Seizure is a rare risk, and certain implants rule it out." },
      { q: "Do I need a doctor's referral?", a: "We recommend discussing it with your doctor or neurologist first, particularly if your headaches are new, worsening or severe." },
    ],
  },
  {
    slug: "ozone-therapy",
    name: "Ozone Therapy",
    bn: "ওজোন থেরাপি",
    family: "Medical gas",
    summary: "A clinician-delivered treatment sometimes used as an adjunct for joint and back pain. Availability is confirmed at booking.",
    bnSummary: "জয়েন্ট ও পিঠের ব্যথায় সহায়ক হিসেবে কখনো ব্যবহৃত চিকিৎসক-পরিচালিত থেরাপি; বুকিংয়ের সময় প্রাপ্যতা নিশ্চিত করা হয়।",
    image: stock.consultation,
    overview:
      "Medical ozone is a mixture of oxygen and ozone that some clinics use as an add-on for long-standing joint and back pain. It must be given by a suitably qualified clinician, and the evidence base is still developing. We therefore treat it as an optional adjunct, discussed openly after your assessment, never as a first-line promise of recovery.",
    howItWorks:
      "Depending on the method chosen by the treating clinician, ozone may be applied locally to the painful area. It is thought to influence inflammation and circulation, but results vary between people.",
    sessionLength: "About 20–30 minutes",
    typicalCourse: "Decided individually by the treating clinician",
    sensation: "Depends on the method. Your clinician will explain exactly what to expect before you agree.",
    goodFor: ["Persistent knee or joint pain", "Selected chronic low back pain, as an add-on to exercise"],
    tellUsFirst: ["You are pregnant", "You have G6PD deficiency", "You have an overactive thyroid", "You have a serious heart or lung condition", "You take blood thinners"],
    conditionSlugs: ["low-back-pain", "knee-pain", "neck-pain", "joint-pain-arthritis"],
    serviceSlug: "pain-management",
    availability: "confirm",
    faqs: [
      { q: "Is ozone therapy a replacement for surgery or medication?", a: "No. It is an optional add-on. If you have been advised to have surgery or take medication, please discuss any change in plan with your doctor." },
      { q: "Who delivers the treatment?", a: "A suitably qualified clinician. We will tell you who that is and what they will do before any treatment begins." },
    ],
  },
];

export const treatmentBySlug = (slug: string) => treatments.find((t) => t.slug === slug);
