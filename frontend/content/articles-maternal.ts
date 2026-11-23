import { stock } from "@/services/mock/fixtures/images";
import type { Article } from "@/types/content";

/** Maternal-health articles. Original, general-information copy. CLINICAL REVIEW REQUIRED before launch. */
export const maternalArticles: Article[] = [
  {
    slug: "back-pain-in-pregnancy",
    title: "Back and pelvic pain in pregnancy: what helps",
    bnTitle: "গর্ভাবস্থায় কোমর ও পেলভিসের ব্যথা: কী সাহায্য করে",
    excerpt: "Aches are common as your bump grows, but you do not have to simply put up with them. Safe, practical ways to feel better.",
    category: "Women's health",
    publishedOn: "2026-11-22",
    readMinutes: 5,
    image: stock.pregnancy,
    intro:
      "Many women feel back or pelvic pain at some point in pregnancy. It is common, but it is not something you simply have to endure. Small changes to how you move, rest and exercise can bring real relief.",
    sections: [
      {
        heading: "Why it happens",
        paragraphs: ["As your baby grows, your posture and centre of gravity change. Pregnancy hormones also soften the ligaments that support your spine and pelvis, so the joints can move more than usual and the muscles work harder to compensate."],
      },
      {
        heading: "Everyday things that help",
        paragraphs: ["Think of comfort and variety rather than perfect posture."],
        bullets: ["Sleep on your side with a pillow between your knees and one under your bump", "Keep your knees together when turning in bed or getting out of a car", "Avoid standing on one leg and take smaller steps on stairs if the pelvis hurts", "Change position often; short walks are better than long periods sitting or standing", "Use warmth, a supportive belt or a rolled towel behind the lower back if comfortable"],
      },
      {
        heading: "Exercise in pregnancy",
        paragraphs: ["Gentle, regular exercise, such as walking, pelvic tilts and breathing work, usually helps unless your doctor has advised otherwise. A women's health physiotherapist can tailor exercises to your stage and symptoms."],
      },
      {
        heading: "When to get help straight away",
        paragraphs: ["Contact your doctor or midwife promptly if you have vaginal bleeding, leaking fluid, regular tightening pains, fever, burning when passing urine, a painful swollen calf or a drop in your baby's movements."],
      },
    ],
    keyPoints: ["Common, and treatable", "Gentle movement usually helps", "Some symptoms need a doctor or midwife quickly"],
    conditionSlugs: ["pregnancy-back-pain", "pelvic-girdle-pain"],
  },
  {
    slug: "preparing-your-body-for-pregnancy",
    title: "Preparing your body for pregnancy",
    bnTitle: "গর্ভধারণের জন্য শরীর প্রস্তুত করা",
    excerpt: "Strength, mobility and pelvic health you can build before conceiving, and why it can make pregnancy and recovery easier.",
    category: "Women's health",
    publishedOn: "2026-11-21",
    readMinutes: 4,
    image: stock.beachYoga,
    intro:
      "You do not need to be an athlete to have a healthy pregnancy, but a body that is strong and mobile copes better with the demands of pregnancy, birth and caring for a baby. A little preparation helps.",
    sections: [
      {
        heading: "What to focus on",
        paragraphs: ["Think of four things: legs and hips for carrying weight, a stable core, a pelvic floor you can both tighten and relax, and a mobile upper back after long hours at a desk."],
      },
      {
        heading: "A simple starting routine",
        paragraphs: ["Aim for gentle, regular practice rather than hard training."],
        bullets: ["Walking 20–30 minutes most days", "Squats to a chair and glute bridges, 2 sets of 10", "Slow diaphragmatic breathing, letting the belly and pelvic floor relax on the in-breath", "Hip and chest-opening stretches after sitting"],
      },
      {
        heading: "Speak to your doctor too",
        paragraphs: ["A preconception check-up with your doctor covers medical history, medicines and nutrition. Physiotherapy complements it; it does not replace it. If you have ongoing pain or past birth problems, an assessment can help you start from a good place."],
      },
    ],
    keyPoints: ["Gentle, regular activity is enough to start", "Include pelvic floor awareness", "Combine with a preconception medical check-up"],
    conditionSlugs: ["preconception-readiness"],
  },
  {
    slug: "first-six-weeks-postnatal-recovery",
    title: "The first six weeks after birth: gentle recovery",
    bnTitle: "প্রসবের পর প্রথম ছয় সপ্তাহ: মৃদু পুনরুদ্ধার",
    excerpt: "Rest, gentle movement and a few safe exercises to support your body while you care for your newborn.",
    category: "Women's health",
    publishedOn: "2026-11-20",
    readMinutes: 5,
    image: stock.familyNewborn,
    intro:
      "Your body has done something extraordinary. Healing takes time, and the early weeks are about rest, gentle movement and looking after yourself as well as your baby.",
    sections: [
      {
        heading: "Rest comes first",
        paragraphs: ["Sleep when you can, accept help and avoid heavy lifting beyond your baby. Recovery is not a race; being active in small, comfortable steps is better than overdoing it."],
      },
      {
        heading: "Gentle things you can usually do",
        paragraphs: ["Unless your doctor advises otherwise:"],
        bullets: ["Short, slow walks that you build up gradually", "Slow breathing with a gentle lift of the pelvic floor on the out-breath", "Changing position often when feeding, and supporting your back and arms", "Drinking plenty of fluids and eating regular, nourishing meals"],
      },
      {
        heading: "Feeding and carrying posture",
        paragraphs: ["Bring your baby to you rather than leaning forward. Support your back, relax your shoulders and use pillows. Neck, shoulder and wrist aches are very common, and a physiotherapist can help."],
      },
      {
        heading: "When to call your doctor",
        paragraphs: ["Seek advice about heavy bleeding, fever, a wound that is red or leaking, foul-smelling discharge, a painful swollen leg, chest pain, breathlessness or thoughts of harming yourself or your baby."],
      },
    ],
    keyPoints: ["Rest and gentle movement", "Look after posture when feeding", "Know the warning signs"],
    conditionSlugs: ["diastasis-recti-core", "pelvic-floor-postpartum", "c-section-recovery"],
  },
  {
    slug: "c-section-recovery-movement-guide",
    title: "C-section recovery: moving safely",
    bnTitle: "সিজারের পর নিরাপদে নড়াচড়া",
    excerpt: "How to get in and out of bed, cough, lift and start exercising after a caesarean, with your surgeon's approval.",
    category: "Women's health",
    publishedOn: "2026-11-19",
    readMinutes: 4,
    image: stock.motherChild,
    intro:
      "A caesarean is major surgery. Moving thoughtfully in the first weeks protects your wound and supports healing, and a guided return to exercise rebuilds your core.",
    sections: [
      {
        heading: "Getting up and down",
        paragraphs: ["Roll onto your side, use your arms to push up as your legs lower over the edge of the bed and keep your abdominal muscles gently engaged. Hold a folded towel or pillow against the scar when you cough, laugh or sneeze."],
      },
      {
        heading: "Walking and early movement",
        paragraphs: ["Short, regular walks help circulation and bowel movement and reduce stiffness. Stand tall rather than hunching to protect the scar."],
      },
      {
        heading: "When can I start exercising?",
        paragraphs: ["Gentle breathing, pelvic floor and walking can begin early with your doctor's approval. More demanding core work and scar mobilisation start once the wound is well healed and your surgeon is happy. Your physiotherapist can pace the stages."],
      },
    ],
    keyPoints: ["Support the scar when coughing or sneezing", "Walk little and often", "Progress only with your surgeon's approval"],
    conditionSlugs: ["c-section-recovery"],
  },
];
