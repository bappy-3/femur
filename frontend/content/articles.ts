import { stock } from "@/services/mock/fixtures/images";
import type { Article } from "@/types/content";
import { maternalArticles } from "./articles-maternal";

/**
 * Health-library articles. Original, general-information copy written for Femur.
 * CLINICAL REVIEW REQUIRED: a Femur physiotherapist should review and approve each article before launch.
 */
const generalArticles: Article[] = [
  {
    slug: "back-pain-rest-or-move",
    title: "Back pain: when to rest and when to move",
    bnTitle: "কোমর ব্যথা: কখন বিশ্রাম, কখন নড়াচড়া",
    excerpt: "Bed rest feels sensible, yet most people recover faster by staying gently active. Here is how to tell what is helping and what is not.",
    category: "Back & spine",
    publishedOn: "2026-11-18",
    readMinutes: 5,
    image: stock.manualTherapyAlt,
    intro:
      "When your back suddenly hurts, the natural instinct is to stop everything and lie down. A short rest can help, but long periods of bed rest usually slow recovery. Understanding the difference makes the first few days much easier.",
    sections: [
      {
        heading: "The first 48 hours",
        paragraphs: [
          "Choose positions that ease the pain and change them often. Short, gentle walks every hour or two keep the muscles from stiffening. Heat or a warm shower soothes spasm for many people.",
          "Pain that is moderate and eases with movement is usually a muscle or joint problem. Do not worry if you cannot do everything normally; the aim is to stay as active as comfort allows.",
        ],
      },
      {
        heading: "What helps recovery",
        paragraphs: ["Small, regular actions matter more than one big effort."],
        bullets: ["Walk a little more each day", "Change position every 30 minutes at a desk", "Sleep on your side with a pillow between your knees if that is comfortable", "Return to normal tasks gradually rather than all at once"],
      },
      {
        heading: "When to get checked",
        paragraphs: [
          "See a doctor promptly if you lose control of your bladder or bowel, feel numbness around the groin, notice growing weakness in a leg, or have back pain after a serious fall. Pain that does not improve after a few weeks is a good moment to book an assessment.",
        ],
      },
    ],
    keyPoints: ["Gentle movement beats prolonged bed rest", "Pain usually settles; a plan prevents repeat episodes", "Some symptoms need medical attention first"],
    conditionSlugs: ["low-back-pain", "leg-pain-sciatica"],
  },
  {
    slug: "desk-neck-shoulder-reset",
    title: "A 10-minute neck and shoulder reset for desk workers",
    bnTitle: "ডেস্কে কাজ করলে ঘাড়-কাঁধের ১০ মিনিটের ব্যায়াম",
    excerpt: "Four simple movements you can do at your desk to ease the tightness that builds up through the working day.",
    category: "Work & posture",
    publishedOn: "2026-11-15",
    readMinutes: 4,
    image: stock.painNeck,
    intro:
      "Neck and shoulder tension often builds up silently through a long day at a screen. The best 'posture' is the next one: variety and regular movement matter more than holding a perfect position.",
    sections: [
      {
        heading: "Set up first",
        paragraphs: ["Raise your screen so the top is close to eye level, keep your forearms supported, and keep your feet flat. If you use a laptop, a separate keyboard makes a big difference."],
      },
      {
        heading: "The reset",
        paragraphs: ["Do each movement slowly and stop if you feel sharp pain or tingling."],
        bullets: ["Chin tucks: gently glide your chin back, hold 5 seconds, repeat 8 times", "Shoulder rolls: 10 slow circles backwards", "Upper-trapezius stretch: tilt your ear toward your shoulder, hold 20–30 seconds each side", "Doorway chest stretch: forearm on the frame, step through, hold 20–30 seconds"],
      },
      {
        heading: "Make it a habit",
        paragraphs: ["Set a repeating reminder every 45 minutes to stand, drink water and move. If headaches, arm pain or tingling persist, an assessment can find the cause."],
      },
    ],
    keyPoints: ["Change position often", "Small, frequent movement breaks work best", "Persistent arm symptoms deserve an assessment"],
    conditionSlugs: ["neck-pain", "migraine-headache"],
  },
  {
    slug: "knee-pain-before-you-assume-arthritis",
    title: "Knee pain: what to check before you assume it is arthritis",
    bnTitle: "হাঁটু ব্যথা: আর্থ্রাইটিস ধরে নেওয়ার আগে কী দেখবেন",
    excerpt: "Not all knee pain is wear and tear. Understanding the pattern of your pain points to the right kind of help.",
    category: "Joints",
    publishedOn: "2026-11-12",
    readMinutes: 5,
    image: stock.kneeExercise,
    intro:
      "Many people are told 'it's just age' when their knees hurt. Arthritis is common, but tendon irritation, kneecap pain and weak hip muscles are just as frequent, and they respond very well to targeted exercise.",
    sections: [
      {
        heading: "Notice the pattern",
        paragraphs: ["Where and when it hurts gives useful clues."],
        bullets: ["Pain at the front with stairs or squats often involves the kneecap or tendons", "Stiffness after rest that eases within 30 minutes often fits osteoarthritis", "Locking or giving way after a twist suggests a meniscus or ligament problem", "A hot, red, swollen knee needs prompt medical review"],
      },
      {
        heading: "What usually helps",
        paragraphs: [
          "Strengthening the thigh, hip and calf muscles takes load off the joint. Pacing activity, choosing supportive footwear and reducing sudden spikes in walking, stairs or exercise are also important. Pain-relieving treatments can make this exercise easier to start.",
        ],
      },
    ],
    keyPoints: ["Different knee problems need different treatment", "Exercise is a core part of arthritis care", "Sudden hot, swollen knees need a doctor"],
    conditionSlugs: ["knee-pain", "joint-pain-arthritis"],
  },
  {
    slug: "frozen-shoulder-three-stages",
    title: "Frozen shoulder: the three stages explained",
    bnTitle: "ফ্রোজেন শোল্ডারের তিনটি ধাপ",
    excerpt: "Understanding the painful, stiff and thawing stages helps you know what to expect and what to do at each.",
    category: "Joints",
    publishedOn: "2026-11-09",
    readMinutes: 4,
    image: stock.clinicianWithPatient,
    intro: "Frozen shoulder is frustrating because it develops slowly and can last many months. Knowing the stages helps you stay patient and treat each one appropriately.",
    sections: [
      {
        heading: "Stage 1 — Freezing (painful)",
        paragraphs: ["Pain increases, particularly at night, and movement starts to reduce. The focus is on settling pain and keeping gentle movement going without forcing the joint."],
      },
      {
        heading: "Stage 2 — Frozen (stiff)",
        paragraphs: ["Pain often eases but stiffness dominates. Daily tasks like dressing become difficult. Regular, gentle stretching and mobilisation help preserve and gradually regain range."],
      },
      {
        heading: "Stage 3 — Thawing (recovery)",
        paragraphs: ["Movement slowly returns. Strengthening and functional retraining become the priority to restore confidence and stability."],
      },
    ],
    keyPoints: ["It often takes many months", "Treatment changes at each stage", "Diabetes increases the risk; tell your clinician"],
    conditionSlugs: ["shoulder-pain"],
  },
  {
    slug: "painkillers-and-physiotherapy",
    title: "Painkillers and physiotherapy: how they work together",
    bnTitle: "ব্যথার ওষুধ ও ফিজিওথেরাপি: কীভাবে একসঙ্গে কাজ করে",
    excerpt: "Medicines can make pain bearable; physiotherapy aims to address why it is happening. Both have a place.",
    category: "Understanding pain",
    publishedOn: "2026-11-05",
    readMinutes: 4,
    image: stock.consultation,
    intro:
      "Painkillers are useful, and nobody should suffer needlessly. But pain is a signal, and ongoing pain usually has a reason, such as a stiff joint, a weak muscle or an overloaded tendon. Medicines help you cope; rehabilitation helps tackle the reason.",
    sections: [
      {
        heading: "What medicines do well",
        paragraphs: ["They can take the edge off pain so that you can sleep, move and take part in rehabilitation. Always take them as your doctor or pharmacist advises, and tell them about every medicine you use."],
      },
      {
        heading: "What physiotherapy adds",
        paragraphs: ["Assessment identifies what is driving your pain. Treatment and exercise then improve movement, strength and tolerance so that you rely less on pain relief over time."],
      },
      {
        heading: "Working together",
        paragraphs: ["Please do not stop prescribed medicines without speaking to your doctor. Share your physiotherapy plan with them, particularly if you have arthritis, diabetes, or heart or kidney conditions."],
      },
    ],
    keyPoints: ["Medicine and physiotherapy complement each other", "Never stop prescribed medicine without advice", "Aim for lasting improvement, not just short-term relief"],
    conditionSlugs: ["low-back-pain", "joint-pain-arthritis"],
  },
  {
    slug: "pelvic-floor-after-pregnancy",
    title: "Pelvic floor after pregnancy: what is normal and what to do",
    bnTitle: "প্রসবের পর পেলভিক ফ্লোর: কোনটি স্বাভাবিক, কী করণীয়",
    excerpt: "Leakage and pelvic heaviness after childbirth are common, and they are treatable. A gentle introduction.",
    category: "Women's health",
    publishedOn: "2026-11-02",
    readMinutes: 5,
    image: stock.pregnancy,
    intro: "The pelvic floor is a sling of muscles that supports the bladder, bowel and uterus. Pregnancy and childbirth stretch and strain it, so changes afterwards are very common, and help is available.",
    sections: [
      {
        heading: "Common signs",
        paragraphs: ["Many women notice leaking with a cough or sneeze, a heavy or dragging feeling, or difficulty controlling urgency. These are common but they are not something you simply have to accept."],
      },
      {
        heading: "Starting gently",
        paragraphs: ["Begin with relaxed breathing, letting the belly and pelvic floor soften on the inhale and gently lift on the exhale. A physiotherapist can check that you are using the right muscles, because squeezing the wrong ones or over-tightening can make symptoms worse."],
      },
      {
        heading: "When to seek care",
        paragraphs: ["Book an assessment if symptoms persist beyond a few weeks, if you feel a bulge, or if intercourse is painful. See a doctor urgently for heavy bleeding, fever or blood in the urine."],
      },
    ],
    keyPoints: ["Common but treatable", "Technique matters more than effort", "Care is delivered by female physiotherapists"],
    conditionSlugs: ["pelvic-floor-postpartum", "diastasis-recti-core"],
  },
];

export const articles: Article[] = [...maternalArticles, ...generalArticles];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
