import { stock } from "@/services/mock/fixtures/images";
import type { Condition } from "@/types/content";

/**
 * Maternal conditions: pre-pregnancy, pregnancy and postnatal. Femur's primary focus.
 * Original copy. CLINICAL REVIEW REQUIRED before launch (a women's-health physiotherapist and an obstetric reviewer).
 */
export const maternalConditions: Condition[] = [
  {
    slug: "pregnancy-back-pain",
    name: "Back Pain in Pregnancy",
    bn: "গর্ভাবস্থায় পিঠ ও কোমর ব্যথা",
    group: "Pregnancy",
    summary: "Aching lower or upper back as your body and posture change, and what safely helps.",
    bnSummary: "গর্ভাবস্থায় শরীর ও ভঙ্গি বদলে যাওয়ায় কোমর বা পিঠের ব্যথা এবং নিরাপদ সমাধান।",
    image: stock.pregnancy,
    overview:
      "Back pain affects many women during pregnancy, often from the second trimester as the bump grows, the centre of gravity shifts and hormones soften the ligaments. It is common, but you do not have to simply put up with it. Gentle treatment, supportive positions and the right exercises can make daily life and sleep much more comfortable.",
    symptoms: ["Aching across the lower back, worse by evening", "Pain when standing, walking or turning in bed", "Pain around the shoulder blades or upper back", "Stiffness after sitting for long periods"],
    commonCauses: ["Changing posture and weight of the bump", "Hormones loosening ligaments and joints", "Weaker abdominal and hip muscles", "Standing or sitting for long periods", "Poor sleeping position"],
    approach: ["Assessment suited to your stage of pregnancy", "Gentle hands-on care in comfortable positions", "Safe strengthening and mobility exercise", "Advice on sleeping, sitting, lifting and support belts"],
    treatmentSlugs: ["manual-therapy"],
    serviceSlug: "pregnancy-rehabilitation",
    seeDoctorIf: ["Vaginal bleeding or leaking fluid", "Regular, tightening pain in the lower abdomen or back (possible contractions)", "Back pain with fever, burning when passing urine or blood in urine", "Numbness around the groin or loss of bladder or bowel control", "Severe or sudden pain, or reduced baby movements"],
    faqs: [
      { q: "Is physiotherapy safe during pregnancy?", a: "Yes, when delivered by a physiotherapist trained in women's health and adapted to your stage of pregnancy. We work alongside your doctor or midwife and tell you which activities to avoid." },
      { q: "Which sleeping position is best?", a: "Most women are comfortable on their side with a pillow between the knees and another under the bump. We will help you find what works for you." },
      { q: "Can I keep exercising?", a: "Usually yes, unless your doctor has advised otherwise. We help you choose safe, comfortable exercise and adjust it as pregnancy progresses." },
    ],
    relatedArticleSlugs: ["back-pain-in-pregnancy", "back-pain-rest-or-move"],
  },
  {
    slug: "pelvic-girdle-pain",
    name: "Pelvic Girdle & Hip Pain",
    bn: "গর্ভাবস্থায় পেলভিস ও নিতম্বের ব্যথা",
    group: "Pregnancy",
    summary: "Pain at the front or back of the pelvis, groin or hips when walking, climbing stairs or turning in bed.",
    bnSummary: "হাঁটা, সিঁড়ি ওঠা বা পাশ ফেরার সময় পেলভিস, কুঁচকি বা নিতম্বে ব্যথা।",
    image: stock.motherhood,
    overview:
      "Pelvic girdle pain (including pain at the pubic joint, sometimes called symphysis pubis dysfunction) is a common and often misunderstood part of pregnancy. The pelvic joints move more than usual and the muscles around them work harder. It can be very uncomfortable, but it is treatable, and good advice early on makes a real difference.",
    symptoms: ["Pain at the front of the pelvis or in the groin", "Pain deep in the buttocks or at the back of the pelvis", "Clicking or a feeling of instability", "Pain turning in bed, climbing stairs or standing on one leg"],
    commonCauses: ["Hormonal loosening of pelvic ligaments", "Uneven load across the pelvic joints", "Weak hip and core muscles", "A previous pelvic injury or back pain"],
    approach: ["Identify which joints and movements trigger pain", "Gentle hands-on techniques and positioning advice", "Targeted stabilising exercise", "Support belts, pacing and everyday movement tips (stairs, getting in and out of bed or a car)"],
    treatmentSlugs: ["manual-therapy"],
    serviceSlug: "pregnancy-rehabilitation",
    seeDoctorIf: ["Vaginal bleeding or leaking fluid", "Pain with fever or burning when passing urine", "Calf pain, redness or swelling on one leg", "Severe or sudden pain that does not ease with rest"],
    faqs: [
      { q: "Will it go away after the baby is born?", a: "For most women it improves significantly after birth, though it can take some weeks. Physiotherapy during and after pregnancy helps recovery." },
      { q: "Can I still have a normal delivery?", a: "Many women with pelvic girdle pain have a vaginal birth. We can suggest positions that are more comfortable, and you can discuss your birth plan with your doctor or midwife." },
    ],
    relatedArticleSlugs: ["back-pain-in-pregnancy"],
  },
  {
    slug: "preconception-readiness",
    name: "Preparing for Pregnancy",
    bn: "গর্ভধারণের আগে শরীর প্রস্তুত করা",
    group: "Pre-pregnancy",
    summary: "Strength, mobility and pelvic health to build before you conceive.",
    bnSummary: "গর্ভধারণের আগে শক্তি, নমনীয়তা ও পেলভিক স্বাস্থ্য গড়ে তোলা।",
    image: stock.beachYoga,
    overview:
      "A healthy, strong body copes better with the demands of pregnancy, birth and early motherhood. Preparing in advance can mean less back and pelvic pain later and a smoother recovery afterwards. We look at your posture, core and pelvic floor, treat any existing aches and set up a routine you can sustain.",
    symptoms: ["Existing low back, hip or pelvic pain", "Tight hips or a stiff upper back from desk work", "Difficulty feeling or controlling your pelvic floor", "A past difficult pregnancy or delivery"],
    commonCauses: ["Long hours of sitting", "Low general fitness", "Previous injuries not fully rehabilitated", "Past pregnancy or delivery that was not followed by rehabilitation"],
    approach: ["Posture, core, hip and pelvic floor assessment", "Treat existing pain and stiffness", "Gentle strength, mobility and breathing programme", "Guidance on when to involve your doctor"],
    treatmentSlugs: ["manual-therapy"],
    serviceSlug: "preconception-care",
    seeDoctorIf: ["You have not yet discussed conception plans with your doctor and have an ongoing medical condition", "Irregular or very painful periods, or pain during intercourse", "Unexplained pelvic pain or abnormal bleeding"],
    faqs: [
      { q: "When should I start preparing?", a: "Any time is helpful. A few months before trying to conceive gives you time to build strength and habits, but starting later is still worthwhile." },
      { q: "Do I need to see a doctor first?", a: "We recommend a preconception check-up with your doctor. Physiotherapy complements that advice; it does not replace it." },
    ],
    relatedArticleSlugs: ["preparing-your-body-for-pregnancy"],
  },
  {
    slug: "diastasis-recti-core",
    name: "Core Recovery & Separated Abdominal Muscles",
    bn: "প্রসবের পর পেটের পেশি আলাদা হয়ে যাওয়া ও কোর পুনরুদ্ধার",
    group: "Postnatal",
    summary: "A soft, doming tummy, a weak core or back pain after pregnancy, and how to rebuild safely.",
    bnSummary: "প্রসবের পর পেট নরম বা উঁচু দেখানো, দুর্বল কোর বা কোমর ব্যথা এবং নিরাপদে পুনর্গঠন।",
    image: stock.babyFeet,
    overview:
      "During pregnancy the two sides of the abdominal wall stretch apart, a normal change known as diastasis recti. For many women it narrows on its own, but for some it leaves a lasting gap, a weak core and back or pelvic pain. Rebuilding with the right exercises, not endless crunches, restores support and confidence.",
    symptoms: ["A ridge or doming along the middle of the tummy when you sit up", "A feeling that your core is weak or 'not connected'", "Lower back or pelvic pain", "Leaking or pelvic heaviness with effort"],
    commonCauses: ["Stretching of the abdominal wall in pregnancy", "Multiple or closely spaced pregnancies", "Heavy lifting or straining early after birth", "Weakness of deep core and pelvic floor muscles"],
    approach: ["Check the width and tension of the abdominal wall", "Breathing and deep core re-connection", "Staged strengthening for core, hips and pelvic floor", "Guidance on lifting, feeding positions and returning to exercise"],
    treatmentSlugs: ["manual-therapy"],
    serviceSlug: "postnatal-recovery",
    seeDoctorIf: ["A painful, tender or irreducible bulge", "Heavy or increasing vaginal bleeding", "Fever, or a wound that is red, swollen or leaking"],
    faqs: [
      { q: "Do I have to avoid sit-ups forever?", a: "No. In the early weeks we avoid exercises that strain the abdominal wall, then progress it gradually. Most women return to full exercise with a plan." },
      { q: "When can I start after delivery?", a: "Gentle breathing and walking can start early with your doctor's approval. We assess you and start structured work when you are ready." },
    ],
    relatedArticleSlugs: ["first-six-weeks-postnatal-recovery"],
  },
  {
    slug: "c-section-recovery",
    name: "C-section Recovery",
    bn: "সিজারের পর পুনরুদ্ধার",
    group: "Postnatal",
    summary: "Gentle movement, scar care and core rebuilding after a caesarean birth.",
    bnSummary: "সিজারের পর মৃদু নড়াচড়া, কাটা স্থানের যত্ন ও কোর পুনর্গঠন।",
    image: stock.familyNewborn,
    overview:
      "A caesarean is major abdominal surgery as well as the birth of a baby. Recovery takes time, and many women are not told how to move, lift and exercise safely. With your surgeon's clearance, physiotherapy can ease pain and stiffness, help the scar and tissues around it move well, and rebuild your core step by step.",
    symptoms: ["Pain, pulling or tightness around the scar", "Numbness or sensitivity around the scar", "Difficulty standing upright, coughing or getting out of bed", "Back pain from lifting and feeding"],
    commonCauses: ["Surgical healing of the abdominal wall", "Reduced movement in the first weeks", "Stretched and weakened core muscles", "Feeding and carrying positions"],
    approach: ["Wait for your doctor's clearance before starting scar work", "Breathing, walking and bed-mobility guidance", "Gentle scar and soft-tissue mobilisation once healed", "Progressive core, pelvic floor and strength rebuilding"],
    treatmentSlugs: ["manual-therapy"],
    serviceSlug: "postnatal-recovery",
    seeDoctorIf: ["Fever or chills", "A wound that is red, hot, swollen, opening or discharging", "Heavy bleeding or foul-smelling discharge", "Painful, swollen calf, chest pain or breathlessness (seek emergency care)"],
    faqs: [
      { q: "How soon can I start exercises?", a: "Gentle breathing, walking and positioning advice can usually start in the first days. Structured exercise and scar work start once your surgeon is happy with your healing." },
      { q: "Can I lift my baby?", a: "Yes, you will usually lift your baby, but we show you ways to do it that protect your wound and back. Avoid lifting anything heavier until you are cleared." },
    ],
    relatedArticleSlugs: ["c-section-recovery-movement-guide", "first-six-weeks-postnatal-recovery"],
  },
];
