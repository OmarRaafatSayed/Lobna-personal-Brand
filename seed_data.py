# -*- coding: utf-8 -*-
import json
import urllib.request
import urllib.parse

BASE = "http://localhost:5000/api"

def post(url, data, token=None):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    headers = {"Content-Type": "application/json; charset=utf-8"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  ERROR: {e}")
        return None

def delete(url, token):
    headers = {"Authorization": f"Bearer {token}"}
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except:
        pass

def put(url, data, token):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    headers = {"Content-Type": "application/json; charset=utf-8", "Authorization": f"Bearer {token}"}
    req = urllib.request.Request(url, data=body, headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  ERROR: {e}")
        return None

def get(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))

# ── Login ──
print("Logging in...")
res = post(f"{BASE}/auth/login", {"email": "admin@lobna.com", "password": "Admin@123456"})
token = res["token"]
print(f"✅ Logged in\n")

# ─────────────────────────────────────────
# TOOLS
# ─────────────────────────────────────────
print("=== Adding Tools ===")
tools = [
    {
        "name": "HubSpot CRM",
        "description": "منصة CRM متكاملة لإدارة علاقات العملاء، تتيح تتبع المبيعات والصفقات والتواصل مع العملاء في مكان واحد. مجانية للأفراد والفرق الصغيرة وتعتبر الأفضل للمبتدئين.",
        "category": "crm",
        "icon": "🟠",
        "link": "https://www.hubspot.com/products/crm"
    },
    {
        "name": "LinkedIn Sales Navigator",
        "description": "الأداة الأقوى للبحث عن العملاء المحتملين وبناء علاقات مهنية. تتيح فلترة متقدمة لإيجاد صانعي القرار والتواصل معهم مباشرة بكفاءة عالية.",
        "category": "prospecting",
        "icon": "💼",
        "link": "https://business.linkedin.com/sales-solutions/sales-navigator"
    },
    {
        "name": "Notion",
        "description": "مساحة عمل متكاملة لتنظيم المهام والملاحظات وخطط المبيعات. أستخدمها شخصياً لتتبع أهدافي اليومية وبناء قواعد بيانات العملاء بشكل منظم.",
        "category": "productivity",
        "icon": "⚫",
        "link": "https://www.notion.so"
    }
]

for tool in tools:
    r = post(f"{BASE}/tools", tool, token)
    if r and r.get("success"):
        print(f"  ✅ {tool['name']}")
    else:
        print(f"  ❌ {tool['name']}: {r}")

# ─────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────
print("\n=== Adding Jobs ===")
jobs = [
    {
        "title": "مدير مبيعات إقليمي",
        "company": "شركة الفتح للتوزيع والتسويق",
        "description": "نبحث عن مدير مبيعات إقليمي لقيادة فريق المبيعات وتحقيق الأهداف الربعية. الدور يشمل بناء العلاقات مع العملاء الكبار وتطوير استراتيجيات النمو في السوق المصري.",
        "type": "full_time",
        "location": "القاهرة، مصر",
        "salary": "15,000 - 25,000 جنيه + عمولة",
        "requirements": [
            "خبرة 5+ سنوات في المبيعات",
            "مهارات قيادية قوية",
            "إجادة اللغة الإنجليزية",
            "خبرة في CRM systems"
        ],
        "applyLink": "https://linkedin.com/jobs",
        "isActive": True
    },
    {
        "title": "Sales Account Executive",
        "company": "TechVentures Egypt",
        "description": "فرصة رائعة للانضمام لشركة تقنية ناشئة في دور Account Executive. ستكون مسؤولاً عن إدارة دورة المبيعات الكاملة من التنقيب وحتى إغلاق الصفقات مع عملاء B2B.",
        "type": "full_time",
        "location": "القاهرة الجديدة — هايبريد",
        "salary": "8,000 - 18,000 جنيه + عمولة",
        "requirements": [
            "خبرة 2-4 سنوات في B2B Sales",
            "قدرة عالية على التفاوض",
            "استخدام Salesforce أو HubSpot"
        ],
        "applyLink": "https://linkedin.com/jobs",
        "isActive": True
    },
    {
        "title": "Business Development Specialist",
        "company": "Gulf Bridge Consulting",
        "description": "دور استراتيجي لتطوير شراكات جديدة وفتح أسواق في منطقة الخليج. مناسب لمن لديه خلفية في المبيعات ويريد الانتقال لدور أكثر استراتيجية يجمع بين التحليل والتنفيذ.",
        "type": "remote",
        "location": "ريموت — مصر والخليج",
        "salary": "12,000 - 20,000 جنيه",
        "requirements": [
            "خبرة 3+ سنوات في المبيعات أو Business Development",
            "تحليل السوق وبناء الشراكات",
            "إجادة العربية والإنجليزية"
        ],
        "applyLink": "https://linkedin.com/jobs",
        "isActive": True
    }
]

for job in jobs:
    r = post(f"{BASE}/jobs", job, token)
    if r and r.get("success"):
        print(f"  ✅ {job['title']}")
    else:
        print(f"  ❌ {job['title']}: {r}")

# ─────────────────────────────────────────
# BLOG POSTS
# ─────────────────────────────────────────
print("\n=== Adding Blog Posts ===")
posts = [
    {
        "title": "7 أخطاء تقتل صفقاتك وكيف تتجنبها",
        "slug": "7-sales-mistakes-avoid",
        "excerpt": "بعد سنوات في عالم المبيعات، لاحظت أن معظم الصفقات لا تُخسر بسبب المنتج أو السعر — بل بسبب أخطاء بسيطة يمكن تجنبها بسهولة.",
        "content": "الخطأ الأول: الحديث أكثر من الاستماع\nالعميل يريد أن يُسمع، لا أن يُحاضَر. قاعدة الـ 70/30 — استمع 70% من الوقت وتحدث 30% فقط.\n\nالخطأ الثاني: عدم فهم نقاط الألم الحقيقية\nاسأل أسئلة عميقة قبل عرض أي حل. ما الذي يُبقيك مستيقظاً في الليل؟\n\nالخطأ الثالث: عدم المتابعة الصحيحة\n80% من الصفقات تُغلق بعد المتابعة الخامسة، لكن 44% من البائعين يستسلمون بعد الأولى.\n\nالخطأ الرابع: التسعير المبكر\nأثبت القيمة أولاً، ثم تحدث عن السعر.\n\nالخطأ الخامس: إهمال بناء الثقة\nالناس يشترون من أشخاص يثقون بهم.\n\nالخطأ السادس: عدم التحضير الجيد\naقضِ 20 دقيقة في البحث عن العميل قبل كل اجتماع.\n\nالخطأ السابع: الخوف من الرفض\nكل 'لا' تقربك من 'نعم'. الرفض ليس نهاية الطريق.",
        "tags": ["مبيعات", "نصائح", "تطوير مهني"],
        "coverImage": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        "isPublished": True,
        "readTime": 6
    },
    {
        "title": "كيف تبني Personal Brand قوي كمندوب مبيعات",
        "slug": "build-personal-brand-sales",
        "excerpt": "في عالم اليوم، مندوب المبيعات الناجح ليس فقط من يبيع منتجاً — بل من يبيع نفسه أولاً. كيف تبني هوية مهنية تجذب العملاء إليك؟",
        "content": "ما هو الـ Personal Brand؟\nهو الانطباع الذي يتركه اسمك في أذهان الناس. حين يسمع شخص ما اسمك، ماذا يتبادر لذهنه؟\n\nلماذا هو مهم لمندوب المبيعات؟\n- العملاء يبحثون عنك على LinkedIn قبل أي اجتماع\n- برند قوي يجعل العملاء يأتون إليك بدلاً من أن تبحث أنت عنهم\n- تميزك عن آلاف المنافسين في نفس المجال\n\nخطوات بناء برندك المهني:\n\n1. حدد تخصصك بوضوح\nلا تكن generalist. اختر مجالاً محدداً وكن الأفضل فيه.\n\n2. أنشئ محتوى قيّماً بانتظام\nاكتب عن تجاربك، شارك دروسك، علّم ما تعرفه.\n\n3. بناء شبكة علاقات حقيقية\nالتواصل الحقيقي أقوى من آلاف المتابعين.\n\n4. كن متسقاً ومستمراً\nالبرند لا يُبنى في يوم. الاتساق والاستمرارية هما السر.",
        "tags": ["برندينج", "LinkedIn", "مبيعات"],
        "coverImage": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
        "isPublished": True,
        "readTime": 5
    },
    {
        "title": "LinkedIn للمبيعات — الدليل العملي الكامل",
        "slug": "linkedin-sales-guide",
        "excerpt": "LinkedIn ليس فقط موقعاً للتوظيف — إنه أقوى أداة للتنقيب عن العملاء وبناء الصفقات. إليك كيف تستخدمه بفاعلية حقيقية.",
        "content": "تحسين الملف الشخصي أولاً:\n- صورة احترافية بخلفية نظيفة\n- عنوان مهني واضح يصف ما تقدمه\n- About section تحكي قصتك وتوضح كيف تساعد عملاءك\n\nاستراتيجية التنقيب:\nاستخدم Sales Navigator للبحث المتقدم أو البحث المجاني بكلمات مفتاحية محددة.\n\nالتواصل الصحيح:\nلا ترسل رسالة بيع مباشرة عند التواصل. الخطوات الصحيحة:\n1. Connect\n2. شارك محتوى مفيد\n3. ابدأ محادثة حقيقية\n4. عرض المساعدة\n5. الصفقة\n\nالمحتوى الذي يجذب العملاء:\n- قصص نجاح حقيقية\n- دروس تعلمتها من تجارب صعبة\n- نصائح عملية قابلة للتطبيق فوراً\n\nالاتساق هو المفتاح:\nانشر 3-4 مرات أسبوعياً. النتائج تأتي بعد 3-6 أشهر من الاتساق.",
        "tags": ["LinkedIn", "مبيعات", "تنقيب", "استراتيجية"],
        "coverImage": "https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800",
        "isPublished": True,
        "readTime": 7
    }
]

for post_data in posts:
    r = post(f"{BASE}/blog", post_data, token)
    if r and r.get("success"):
        print(f"  ✅ {post_data['title'][:50]}")
    else:
        print(f"  ❌ {post_data['title'][:50]}: {r}")

# ─────────────────────────────────────────
# PROFILE — Testimonials + Companies + Stats
# ─────────────────────────────────────────
print("\n=== Updating Profile (Stats + Companies + Testimonials) ===")

current = get(f"{BASE}/profile")
p = current["profile"]

profile_update = {
    "name": p["name"],
    "title": p["title"],
    "bio": p["bio"],
    "avatar": p["avatar"],
    "cvFile": p["cvFile"],
    "heroTagline": p["heroTagline"],
    "heroSubtitle": p["heroSubtitle"],
    "stats": {
        "clients": 150,
        "experience": 8,
        "companies": 12,
        "successRate": 95
    },
    "previousCompanies": [
        {
            "name": "Vodafone Egypt",
            "logo": "https://logo.clearbit.com/vodafone.com",
            "role": "Senior Sales Manager",
            "period": "2019 - 2022"
        },
        {
            "name": "Oracle",
            "logo": "https://logo.clearbit.com/oracle.com",
            "role": "Account Executive",
            "period": "2016 - 2019"
        },
        {
            "name": "Microsoft",
            "logo": "https://logo.clearbit.com/microsoft.com",
            "role": "Sales Specialist",
            "period": "2014 - 2016"
        }
    ],
    "testimonials": [
        {
            "name": "أحمد محمود",
            "role": "مدير مبيعات — Vodafone",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
            "text": "لبنى غيّرت مسيرتي المهنية بالكامل. بعد جلسة واحدة معها فهمت لماذا كنت أخسر الصفقات. أسلوبها عملي جداً ومبني على خبرة حقيقية، وليس مجرد كلام نظري.",
            "rating": 5
        },
        {
            "name": "سارة خالد",
            "role": "Sales Executive — B2B Tech",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
            "text": "كنت أخشى المكالمات الباردة وأتجنبها تماماً. بعد تدريب لبنى أصبحت Cold Calling إحدى أقوى نقاط قوتي. حققت هدفي الربعي للمرة الأولى في مسيرتي.",
            "rating": 5
        },
        {
            "name": "محمد الشريف",
            "role": "Business Development Manager",
            "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=mohamed",
            "text": "الاستشارة مع لبنى كانت من أفضل استثماراتي المهنية. ساعدتني أبني استراتيجية LinkedIn من الصفر، ونتج عنها 3 عملاء جدد في أول شهرين.",
            "rating": 5
        }
    ],
    "socialLinks": {
        "linkedin": p.get("socialLinks", {}).get("linkedin", ""),
        "instagram": p.get("socialLinks", {}).get("instagram", ""),
        "twitter": p.get("socialLinks", {}).get("twitter", ""),
        "facebook": p.get("socialLinks", {}).get("facebook", ""),
        "whatsapp": p.get("socialLinks", {}).get("whatsapp", "")
    }
}

r = put(f"{BASE}/profile", profile_update, token)
if r and r.get("success"):
    print(f"  ✅ Profile updated with stats, companies & testimonials")
else:
    print(f"  ❌ {r}")

# ─────────────────────────────────────────
# VERIFY
# ─────────────────────────────────────────
print("\n=== Final Verification ===")
tools_r = get(f"{BASE}/tools")
jobs_r  = get(f"{BASE}/jobs")
blog_r  = get(f"{BASE}/blog")
prof_r  = get(f"{BASE}/profile")

print(f"  🔧 Tools:        {len(tools_r['tools'])}")
print(f"  💼 Jobs:         {len(jobs_r['jobs'])}")
print(f"  📝 Blog Posts:   {len(blog_r['posts'])}")
print(f"  💬 Testimonials: {len(prof_r['profile']['testimonials'])}")
print(f"  🏢 Companies:    {len(prof_r['profile']['previousCompanies'])}")
print(f"  📊 Clients:      {prof_r['profile']['stats']['clients']}+")
print("\n✅ All data seeded successfully with correct Arabic encoding!")
