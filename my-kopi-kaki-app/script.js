let currentLanguage = 'en'; // Default language

// Translations are embedded inline rather than fetched via translations.json
// because opening index_old.html directly from the filesystem (file:// URL)
// blocks fetch() with a CORS error and leaves the page stuck in English.
const translations = {
    "en": {
        "appTitle": "OTH Buddy",
        "emailLabel": "Email",
        "passwordLabel": "Password",
        "forgotPasswordLink": "Forget password?",
        "signInButton": "Sign in",
        "signUpText": "Don't have an account? Sign Up",
        "versionText": "Version 1.2",
        "welcomeTitle": "Welcome!",
        "englishButton": "English",
        "chineseButton": "中文",
        "malayButton": "Bahasa Melayu",
        "skipBtn": "Skip",
        "interestsTitle": "What are you interested in?",
        "interestsSubtitle": "Pick a few to personalise your feed at Tampines Hub",
        "continueBtn": "Continue",
        "interestFood": "Food",
        "interestFitness": "Fitness",
        "interestHealthcare": "Healthcare",
        "interestFinancial": "Financial Services",
        "interestMovies": "Movies",
        "interestLibrary": "Library",
        "interestShopping": "Shopping",
        "interestArts": "Arts & Culture",
        "interestNature": "Parks & Nature",
        "interestCommunity": "Community Events",
        "interestSwimming": "Swimming",
        "interestDance": "Dance",
        "interestFamily": "Family & Kids",
        "interestEducation": "Education",
        "homeTitle": "OTH Buddy",
        "eventsHappeningSoon": "Events happening soon",
        "thingsToDoTitle": "Things to do at Tampines Hub",
        "cardFood": "Food & Hawker",
        "cardHealthcare": "Healthcare",
        "cardLibrary": "Regional Library",
        "cardSwim": "Swimming Complex",
        "cardGym": "Fitness Gym",
        "cardPlaza": "Festive Plaza",
        "readMoreButton": "Read More",
        "fitness": "Fitness",
        "movie": "Movie",
        "storytelling": "Storytelling",
        "family": "Family",
        "dance": "Dance",
        "education": "Education",
        "workshop": "Workshop",
        "wellness": "Wellness",
        "byOTH": "By Our Tampines Hub",
        "byChangkatCC": "By Tampines Changkat CC",
        "byTampinesNorth": "By Tampines North",
        "byESH": "By ESH@Tampines",
        "byParkviewRN": "By Tampines Parkview RN",
        "freeEntry": "Free entry",
        "othFitnessTitle": "Keep Fit @ Our Tampines Hub",
        "othFitnessSubtitle": "Workouts at Gate 1",
        "othFitnessDescription": "Stay active and join workouts of various intensity levels at Our Tampines Hub Gate 1. No pre-registration required — first-come, first-served (max 35 pax without equipment, 20 with).",
        "wickedTitle": "Movie Night: Wicked",
        "wickedSubtitle": "Tampines Changkat CC",
        "wickedDescription": "Join us for a magical movie night featuring \"Wicked\" on the big screen. Bring family and friends for an evening of fun, laughter and community bonding.",
        "wickedRegister": "go.gov.sg/tckmcmay26",
        "grandpaOxTitle": "The Girl, Grandpa and Ox",
        "grandpaOxSubtitle": "OTH Wellness Garden, L5",
        "grandpaOxDescription": "Granddaughter and Grandpa set off on foot to sell their Ox at the faraway market. Along the way, strangers give them opposite ideas on how to travel — will the three arrive safely?",
        "grandpaOxDate": "23 May, 6-7pm",
        "familySportsTitle": "Family Sports Day",
        "familySportsSubtitle": "SPACE @ OTH, Level 2",
        "familySportsDescription": "A fun-packed afternoon for parents and children to get active together. Mass Workout, Target Toss, Jenga, Mini Sports & Obstacle Course. FREE goodie bags + Lucky Draw. Just $2 per pax.",
        "familySportsDate": "30 May, 10am-2pm",
        "streetDanceTitle": "Chinese Street Dance Finals",
        "streetDanceSubtitle": "爱上华文街舞比赛 2026",
        "streetDanceDescription": "Grand Finals heading to Our Tampines Hub! High-octane energy from secondary school students. Come scream for your favourite team and catch the weekend 正能量 (positive energy).",
        "streetDanceDate": "23 May, 2pm",
        "ltaTalkTitle": "New PMA Regulations Talk",
        "ltaTalkSubtitle": "ESH@Tampines × LTA",
        "ltaTalkDescription": "For PMA users and caregivers — learn about Singapore's new speed limit rules, medical certification requirements, and safe usage on public paths before regulations take effect.",
        "ltaTalkRegister": "bit.ly/4dlRcAD",
        "mangaTitle": "Basic Manga Art",
        "mangaSubtitle": "June Holidays · Tampines North",
        "mangaDescription": "Give your child a creative June-holiday adventure. 8 fun sessions learning to draw their own manga characters from scratch. Spots filling up fast!",
        "mangaLink": "onepa.gov.sg",
        "plushieTitle": "Make A Plushie",
        "plushieSubtitle": "June Holidays · Tampines North",
        "plushieDescription": "Craft and bring home your very own handmade plushie. A perfect creative session for kids to explore their imagination and make lasting memories with friends.",
        "plushieLink": "onepa.gov.sg",
        "crochetTitle": "Crochet Your Own Flower",
        "crochetSubtitle": "Function Room 2, L4",
        "crochetDescription": "Experience the art of crochet and create a beautiful handmade flower. All materials provided with step-by-step guidance — perfect for beginners and craft lovers alike.",
        "crochetDate": "24 May, 10-11am",
        "sachetTitle": "Scented Sachet Making",
        "sachetSubtitle": "OTH Wellness Garden, L5",
        "sachetDescription": "Enjoy a mindful garden walk and craft scented sachets with dried flowers and herbs. Perfect for relaxation, easing fatigue, and better sleep — self-care through nature's gentle gifts.",
        "sachetDate": "23 May, 8.30-9.30am",
        "addToCalendar": "Add to Calendar",
        "markAsImportant": "Mark as Important",
        "removeFromCalendar": "Remove from Calendar",
        "viewFullDetails": "View Full Details",
        "sortTopRated": "⭐ Top rated",
        "sortMostReviewed": "💬 Most reviewed",
        "actionCall": "📞 Call",
        "actionDirections": "🧭 Directions",
        "reviewsTitle": "Reviews",
        "writeReview": "✍️ Write a review",
        "yourRating": "Your rating",
        "reviewPlaceholder": "Share your experience...",
        "cancelBtn": "Cancel",
        "postReviewBtn": "Post review",
        "youBadge": "You",
        "justNow": "Just now",
        "reviewsLabel": "reviews",
        "navHome": "Home",
        "navCalendar": "Calendar",
        "navCamera": "Camera",
        "navCompanion": "Buddy",
        "cameraTitle": "Camera",
        "cameraSubtitle": "Capture memories at Tampines Hub",
        "calendarTitle": "Calendar",
        "calendarSun": "Sun",
        "calendarMon": "Mon",
        "calendarTue": "Tue",
        "calendarWed": "Wed",
        "calendarThu": "Thu",
        "calendarFri": "Fri",
        "calendarSat": "Sat",
        "buddyGreeting": "Hi! I'm Buddy",
        "buddyTagline": "How can I help you today?",
        "buddyIntroMessage": "Hello! I'm Buddy 🤗 You can ask me anything about Tampines Hub — events, clinics, food, library, swimming, or just chat with me. Tap the big mic button if you'd like to speak instead of typing.",
        "buddyInputPlaceholder": "Type your question...",
        "alertRatingRequired": "Please pick a star rating.",
        "alertReviewRequired": "Please write a short review.",
        "alertPhoneUnavailable": "Phone number not available."
    },
    "zh": {
        "appTitle": "OTH Buddy",
        "emailLabel": "电子邮件",
        "passwordLabel": "密码",
        "forgotPasswordLink": "忘记密码？",
        "signInButton": "登录",
        "signUpText": "没有账户？ 注册",
        "versionText": "版本 1.2",
        "welcomeTitle": "欢迎！",
        "englishButton": "English",
        "chineseButton": "中文",
        "malayButton": "Bahasa Melayu",
        "skipBtn": "跳过",
        "interestsTitle": "您对什么感兴趣？",
        "interestsSubtitle": "选择几项,让我们为您个性化淡滨尼天地的内容",
        "continueBtn": "继续",
        "interestFood": "美食",
        "interestFitness": "健身",
        "interestHealthcare": "医疗保健",
        "interestFinancial": "金融服务",
        "interestMovies": "电影",
        "interestLibrary": "图书馆",
        "interestShopping": "购物",
        "interestArts": "艺术与文化",
        "interestNature": "公园与自然",
        "interestCommunity": "社区活动",
        "interestSwimming": "游泳",
        "interestDance": "舞蹈",
        "interestFamily": "家庭与儿童",
        "interestEducation": "教育",
        "homeTitle": "OTH Buddy",
        "eventsHappeningSoon": "即将举行的活动",
        "thingsToDoTitle": "淡滨尼天地的活动",
        "cardFood": "美食与小贩",
        "cardHealthcare": "医疗保健",
        "cardLibrary": "区域图书馆",
        "cardSwim": "游泳中心",
        "cardGym": "健身房",
        "cardPlaza": "节庆广场",
        "readMoreButton": "阅读更多",
        "fitness": "健身",
        "movie": "电影",
        "storytelling": "讲故事",
        "family": "家庭",
        "dance": "舞蹈",
        "education": "教育",
        "workshop": "工作坊",
        "wellness": "健康",
        "byOTH": "由淡滨尼天地主办",
        "byChangkatCC": "由淡滨尼樟卡民众俱乐部主办",
        "byTampinesNorth": "由淡滨尼北区主办",
        "byESH": "由 ESH@Tampines 主办",
        "byParkviewRN": "由 Tampines Parkview RN 主办",
        "freeEntry": "免费入场",
        "othFitnessTitle": "在淡滨尼天地保持健康",
        "othFitnessSubtitle": "1号门健身活动",
        "othFitnessDescription": "保持活跃,参加在淡滨尼天地1号门举行的不同强度的健身课程。无需预先报名 — 先到先得（无器械时最多35人,有器械时最多20人）。",
        "wickedTitle": "电影之夜:《魔法坏女巫》",
        "wickedSubtitle": "淡滨尼樟卡民众俱乐部",
        "wickedDescription": "加入我们的奇幻电影之夜,在大银幕上欣赏《魔法坏女巫》。带上家人和朋友,享受一个充满欢笑与温情的社区之夜。",
        "wickedRegister": "go.gov.sg/tckmcmay26",
        "grandpaOxTitle": "女孩、爷爷和牛",
        "grandpaOxSubtitle": "淡滨尼天地健康花园(5楼)",
        "grandpaOxDescription": "孙女和爷爷徒步前往远方的市场卖牛。一路上,陌生人给了他们截然不同的建议 — 他们三个能否平安到达?",
        "grandpaOxDate": "5月23日 下午6-7点",
        "familySportsTitle": "家庭运动日",
        "familySportsSubtitle": "淡滨尼天地2楼 SPACE",
        "familySportsDescription": "为父母和孩子准备的有趣下午。集体健身、靶向投掷、积木挑战、迷你运动和障碍赛。免费礼品袋 + 抽奖。每位仅需 $2。",
        "familySportsDate": "5月30日 上午10点-下午2点",
        "streetDanceTitle": "华文街舞总决赛",
        "streetDanceSubtitle": "爱上华文街舞比赛 2026",
        "streetDanceDescription": "总决赛来到淡滨尼天地!中学生们带来高能量的精彩表演。为您喜爱的队伍呐喊,感受周末的正能量。",
        "streetDanceDate": "5月23日 下午2点",
        "ltaTalkTitle": "新个人代步工具(PMA)条例讲座",
        "ltaTalkSubtitle": "ESH@Tampines × 陆路交通管理局",
        "ltaTalkDescription": "为PMA使用者及看护者举办 — 在新条例生效前,了解新的速限规定、医疗证明要求,以及在公共道路上的安全使用方式。",
        "ltaTalkRegister": "bit.ly/4dlRcAD",
        "mangaTitle": "漫画基础艺术",
        "mangaSubtitle": "六月假期 · 淡滨尼北区",
        "mangaDescription": "给孩子一个充满创意的六月假期。8节有趣的课程,从零开始学画自己的漫画角色。名额快速填满中!",
        "mangaLink": "onepa.gov.sg",
        "plushieTitle": "亲手做娃娃",
        "plushieSubtitle": "六月假期 · 淡滨尼北区",
        "plushieDescription": "亲手制作一只属于自己的毛绒娃娃带回家。是孩子们探索想象力、与朋友留下美好回忆的完美创意课。",
        "plushieLink": "onepa.gov.sg",
        "crochetTitle": "钩织你的专属小花",
        "crochetSubtitle": "4楼第2功能室",
        "crochetDescription": "体验钩针艺术,亲手制作一朵漂亮的花朵。所有材料都已提供,并有循序渐进的指导 — 适合初学者和手作爱好者。",
        "crochetDate": "5月24日 上午10-11点",
        "sachetTitle": "香薰小袋制作",
        "sachetSubtitle": "淡滨尼天地健康花园(5楼)",
        "sachetDescription": "享受花园漫步,用干花和香草制作香薰小袋。有助于放松身心、缓解疲劳和改善睡眠 — 透过自然之礼自我呵护。",
        "sachetDate": "5月23日 上午8.30-9.30",
        "addToCalendar": "加入日历",
        "markAsImportant": "标记为重要",
        "removeFromCalendar": "从日历中移除",
        "viewFullDetails": "查看完整详情",
        "sortTopRated": "⭐ 评分最高",
        "sortMostReviewed": "💬 评论最多",
        "actionCall": "📞 致电",
        "actionDirections": "🧭 路线指引",
        "reviewsTitle": "评论",
        "writeReview": "✍️ 写评论",
        "yourRating": "您的评分",
        "reviewPlaceholder": "分享您的体验...",
        "cancelBtn": "取消",
        "postReviewBtn": "发布评论",
        "youBadge": "您",
        "justNow": "刚刚",
        "reviewsLabel": "条评论",
        "navHome": "主页",
        "navCalendar": "日历",
        "navCamera": "相机",
        "navCompanion": "伙伴",
        "cameraTitle": "相机",
        "cameraSubtitle": "在淡滨尼天地记录美好回忆",
        "calendarTitle": "日历",
        "calendarSun": "日",
        "calendarMon": "一",
        "calendarTue": "二",
        "calendarWed": "三",
        "calendarThu": "四",
        "calendarFri": "五",
        "calendarSat": "六",
        "buddyGreeting": "你好！我是 Buddy",
        "buddyTagline": "今天我能帮您什么?",
        "buddyIntroMessage": "您好!我是 Buddy 🤗 您可以问我任何关于淡滨尼天地的问题 — 活动、诊所、美食、图书馆、游泳,或者只是和我聊天。如果您想用语音说话,请按下大麦克风按钮。",
        "buddyInputPlaceholder": "输入您的问题...",
        "alertRatingRequired": "请选择星级评分。",
        "alertReviewRequired": "请写一段简短的评论。",
        "alertPhoneUnavailable": "电话号码不可用。"
    },
    "ms": {
        "appTitle": "OTH Buddy",
        "emailLabel": "E-mel",
        "passwordLabel": "Kata Laluan",
        "forgotPasswordLink": "Lupa kata laluan?",
        "signInButton": "Log masuk",
        "signUpText": "Tiada akaun? Daftar",
        "versionText": "Versi 1.2",
        "welcomeTitle": "Selamat Datang!",
        "englishButton": "English",
        "chineseButton": "中文",
        "malayButton": "Bahasa Melayu",
        "skipBtn": "Langkau",
        "interestsTitle": "Apakah minat anda?",
        "interestsSubtitle": "Pilih beberapa untuk peribadikan suapan anda di Tampines Hub",
        "continueBtn": "Teruskan",
        "interestFood": "Makanan",
        "interestFitness": "Kecergasan",
        "interestHealthcare": "Penjagaan Kesihatan",
        "interestFinancial": "Perkhidmatan Kewangan",
        "interestMovies": "Filem",
        "interestLibrary": "Perpustakaan",
        "interestShopping": "Membeli-belah",
        "interestArts": "Seni & Budaya",
        "interestNature": "Taman & Alam Semula Jadi",
        "interestCommunity": "Acara Komuniti",
        "interestSwimming": "Renang",
        "interestDance": "Tarian",
        "interestFamily": "Keluarga & Kanak-kanak",
        "interestEducation": "Pendidikan",
        "homeTitle": "OTH Buddy",
        "eventsHappeningSoon": "Acara akan datang",
        "thingsToDoTitle": "Aktiviti di Tampines Hub",
        "cardFood": "Makanan & Penjaja",
        "cardHealthcare": "Penjagaan Kesihatan",
        "cardLibrary": "Perpustakaan Wilayah",
        "cardSwim": "Kompleks Renang",
        "cardGym": "Gim Kecergasan",
        "cardPlaza": "Plaza Perayaan",
        "readMoreButton": "Baca Lagi",
        "fitness": "Kecergasan",
        "movie": "Filem",
        "storytelling": "Bercerita",
        "family": "Keluarga",
        "dance": "Tarian",
        "education": "Pendidikan",
        "workshop": "Bengkel",
        "wellness": "Kesejahteraan",
        "byOTH": "Oleh Our Tampines Hub",
        "byChangkatCC": "Oleh Tampines Changkat CC",
        "byTampinesNorth": "Oleh Tampines North",
        "byESH": "Oleh ESH@Tampines",
        "byParkviewRN": "Oleh Tampines Parkview RN",
        "freeEntry": "Masuk percuma",
        "othFitnessTitle": "Kekal Cergas @ Our Tampines Hub",
        "othFitnessSubtitle": "Senaman di Pintu 1",
        "othFitnessDescription": "Kekal aktif dan sertai senaman pelbagai tahap intensiti di Our Tampines Hub Pintu 1. Tiada pendaftaran awal diperlukan — siapa cepat dia dapat (maks 35 orang tanpa peralatan, 20 dengan).",
        "wickedTitle": "Malam Filem: Wicked",
        "wickedSubtitle": "Tampines Changkat CC",
        "wickedDescription": "Sertai kami untuk malam filem yang ajaib menampilkan \"Wicked\" di skrin besar. Bawa keluarga dan kawan untuk satu malam keseronokan dan ikatan komuniti.",
        "wickedRegister": "go.gov.sg/tckmcmay26",
        "grandpaOxTitle": "Gadis, Datuk dan Lembu",
        "grandpaOxSubtitle": "OTH Wellness Garden, L5",
        "grandpaOxDescription": "Cucu dan Datuk berjalan kaki untuk menjual lembu mereka di pasar yang jauh. Sepanjang perjalanan, orang asing memberi mereka idea bertentangan — adakah mereka akan sampai dengan selamat?",
        "grandpaOxDate": "23 Mei, 6-7 petang",
        "familySportsTitle": "Hari Sukan Keluarga",
        "familySportsSubtitle": "SPACE @ OTH, Aras 2",
        "familySportsDescription": "Petang yang penuh keseronokan untuk ibu bapa dan anak-anak menjadi aktif bersama. Senaman Massa, Target Toss, Jenga, Sukan Mini & Halangan. Beg cenderahati PERCUMA + Cabutan Bertuah. Hanya $2 sesorang.",
        "familySportsDate": "30 Mei, 10 pagi-2 petang",
        "streetDanceTitle": "Final Tarian Jalanan Cina",
        "streetDanceSubtitle": "爱上华文街舞比赛 2026",
        "streetDanceDescription": "Grand Final menuju ke Our Tampines Hub! Tenaga tinggi daripada pelajar sekolah menengah. Datang sorak pasukan kegemaran anda dan dapatkan tenaga positif hujung minggu.",
        "streetDanceDate": "23 Mei, 2 petang",
        "ltaTalkTitle": "Ceramah Peraturan PMA Baharu",
        "ltaTalkSubtitle": "ESH@Tampines × LTA",
        "ltaTalkDescription": "Untuk pengguna PMA dan penjaga — pelajari peraturan had laju baharu Singapura, keperluan sijil perubatan dan penggunaan selamat di laluan awam sebelum peraturan berkuat kuasa.",
        "ltaTalkRegister": "bit.ly/4dlRcAD",
        "mangaTitle": "Asas Seni Manga",
        "mangaSubtitle": "Cuti Jun · Tampines North",
        "mangaDescription": "Berikan anak anda pengembaraan cuti Jun yang kreatif. 8 sesi menyeronokkan untuk melukis watak manga sendiri dari mula. Tempat cepat penuh!",
        "mangaLink": "onepa.gov.sg",
        "plushieTitle": "Buat Patung Lembut",
        "plushieSubtitle": "Cuti Jun · Tampines North",
        "plushieDescription": "Buat dan bawa pulang patung lembut buatan sendiri. Sesi kreatif yang sempurna untuk anak-anak meneroka imaginasi dan kenangan dengan kawan.",
        "plushieLink": "onepa.gov.sg",
        "crochetTitle": "Mengait Bunga Sendiri",
        "crochetSubtitle": "Bilik Function 2, L4",
        "crochetDescription": "Alami seni mengait dan hasilkan bunga buatan tangan yang cantik. Semua bahan disediakan dengan panduan langkah demi langkah — sesuai untuk pemula dan peminat kraf.",
        "crochetDate": "24 Mei, 10-11 pagi",
        "sachetTitle": "Membuat Sachet Wangi",
        "sachetSubtitle": "OTH Wellness Garden, L5",
        "sachetDescription": "Nikmati jalan santai di taman dan buat sachet wangi dengan bunga kering dan herba. Sesuai untuk relaksasi, mengurangkan keletihan dan tidur yang lebih baik — penjagaan diri melalui hadiah lembut alam semula jadi.",
        "sachetDate": "23 Mei, 8.30-9.30 pagi",
        "addToCalendar": "Tambah ke Kalendar",
        "markAsImportant": "Tanda sebagai Penting",
        "removeFromCalendar": "Buang dari Kalendar",
        "viewFullDetails": "Lihat Butiran Penuh",
        "sortTopRated": "⭐ Rating tertinggi",
        "sortMostReviewed": "💬 Paling banyak diulas",
        "actionCall": "📞 Panggil",
        "actionDirections": "🧭 Arah",
        "reviewsTitle": "Ulasan",
        "writeReview": "✍️ Tulis ulasan",
        "yourRating": "Rating anda",
        "reviewPlaceholder": "Kongsi pengalaman anda...",
        "cancelBtn": "Batal",
        "postReviewBtn": "Hantar ulasan",
        "youBadge": "Anda",
        "justNow": "Baru sahaja",
        "reviewsLabel": "ulasan",
        "navHome": "Laman Utama",
        "navCalendar": "Kalendar",
        "navCamera": "Kamera",
        "navCompanion": "Teman",
        "cameraTitle": "Kamera",
        "cameraSubtitle": "Rakam kenangan di Tampines Hub",
        "calendarTitle": "Kalendar",
        "calendarSun": "Ahad",
        "calendarMon": "Isnin",
        "calendarTue": "Selasa",
        "calendarWed": "Rabu",
        "calendarThu": "Khamis",
        "calendarFri": "Jumaat",
        "calendarSat": "Sabtu",
        "buddyGreeting": "Hai! Saya Buddy",
        "buddyTagline": "Bagaimana saya boleh membantu anda hari ini?",
        "buddyIntroMessage": "Helo! Saya Buddy 🤗 Anda boleh tanya saya apa-apa tentang Tampines Hub — acara, klinik, makanan, perpustakaan, renang, atau berbual sahaja dengan saya. Ketuk butang mikrofon besar jika anda ingin bercakap dan bukan menaip.",
        "buddyInputPlaceholder": "Taip soalan anda...",
        "alertRatingRequired": "Sila pilih rating bintang.",
        "alertReviewRequired": "Sila tulis ulasan ringkas.",
        "alertPhoneUnavailable": "Nombor telefon tidak tersedia."
    }
};

// Synchronously prepare translations and apply them. (No fetch needed —
// translations are embedded inline above to work with file:// URLs.)
function loadTranslations() {
    applyTranslations();
}

// Function to set the language and update content
function setLanguage(lang) {
    console.log('Setting language to:', lang);
    currentLanguage = lang;
    applyTranslations();

    // After picking a language, route first-time users to the interests page
    showPage('interests-page');

    // Reinitialize slideshow after a short delay (so it's ready when user reaches home)
    setTimeout(() => {
        if (window.enhancedSlideshow) {
            window.enhancedSlideshow.stopAutoPlay();
        }
        window.enhancedSlideshow = new EnhancedSlideshow();
    }, 100);
}

// Apply translations to all data-translate elements without changing pages.
// Call this whenever the language might have changed, including when a page
// (e.g. directory or place detail) is re-rendered.
function applyTranslations() {
    const pack = translations[currentLanguage];
    if (!pack) {
        console.error('Translations for language', currentLanguage, 'not found.');
        return;
    }

    // textContent for data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (pack[key]) element.textContent = pack[key];
    });

    // placeholder for data-translate-placeholder
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (pack[key]) element.placeholder = pack[key];
    });

    // Re-render any open directory or place detail page so dynamic strings update
    if (currentDirectoryKey) {
        const dir = directoriesData[currentDirectoryKey];
        const titleEl = document.getElementById('directoryTitle');
        const subEl = document.getElementById('directorySubtitle');
        if (titleEl && dir) titleEl.textContent = t(dir.title);
        if (subEl && dir) subEl.textContent = t(dir.subtitle);
        renderDirectoryList();
    }
    if (currentPlaceId) {
        const place = findPlaceById(currentPlaceId);
        if (place) {
            const stats = combinedRatingFor(place);
            const reviewsLabel = uiText('reviewsLabel', 'reviews');
            const catEl = document.getElementById('placeCategoryLine');
            const hoursEl = document.getElementById('placeHours');
            const countEl = document.getElementById('placeReviewsCount');
            if (catEl) catEl.textContent = t(place.category);
            if (hoursEl) hoursEl.textContent = t(place.hours);
            if (countEl) countEl.textContent = `(${stats.count} ${reviewsLabel})`;
            renderReviewsList();
        }
    }
}

// Interest toggle for the interests selection page
function toggleInterest(card) {
    card.classList.toggle('selected');
}

// Persist the user's selected interests and go to home
function saveInterestsAndContinue() {
    const selected = document.querySelectorAll('.interest-card.selected');
    const interests = Array.from(selected).map(card => card.dataset.interest);
    localStorage.setItem('userInterests', JSON.stringify(interests));
    showPage('home-page');
}

// Skip the interests page — clear any prior selections
function skipInterests() {
    localStorage.setItem('userInterests', JSON.stringify([]));
    showPage('home-page');
}

// Reorder event slides so events matching the user's interests appear first
function personalizeFeed() {
    const track = document.getElementById('enhancedSlidesTrack');
    if (!track) return;

    let interests = [];
    try {
        interests = JSON.parse(localStorage.getItem('userInterests') || '[]');
    } catch (e) {
        interests = [];
    }

    const slides = Array.from(track.querySelectorAll('.enhanced-news-slide'));
    if (slides.length === 0) return;

    // Score each slide by how many of its categories match the user's interests
    const scored = slides.map((slide, originalIndex) => {
        const cats = (slide.dataset.category || '').split(/\s+/).filter(Boolean);
        const score = interests.length === 0
            ? 0
            : cats.reduce((acc, c) => acc + (interests.includes(c) ? 1 : 0), 0);
        return { slide, score, originalIndex };
    });

    // Sort: higher score first; preserve original order on ties
    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.originalIndex - b.originalIndex;
    });

    // Re-append in new order (no-op when scores are all equal)
    scored.forEach(({ slide }) => track.appendChild(slide));

    // Reset the slideshow to the first (now most-relevant) slide
    if (window.enhancedSlideshow) {
        window.enhancedSlideshow.currentSlide = 0;
        window.enhancedSlideshow.updateSlidePosition();
        window.enhancedSlideshow.updateNavDots();
    }
}

// Page navigation function
// Pages shown before the user is "inside" the app shell — these never
// display the desktop top nav.
const ONBOARDING_PAGES = ['signin-page', 'welcome-page', 'interests-page'];

function showPage(pageId) {
    console.log('Showing page:', pageId);
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Desktop top nav: visible only once the user is past onboarding.
    document.body.classList.toggle('app-shell', !ONBOARDING_PAGES.includes(pageId));

    // Highlight the matching site-header link (desktop nav).
    document.querySelectorAll('.site-nav-link').forEach(link => {
        link.classList.toggle('is-active', link.dataset.pageTarget === pageId);
    });

    // Update navigation buttons (mobile bottom nav)
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active nav button based on page
    if (pageId === 'home-page') {
        const homeBtn = document.querySelector('.nav-btn[onclick*="home-page"]');
        if (homeBtn) homeBtn.classList.add('active');
        // Reorder the events feed based on saved interests
        personalizeFeed();
    } else if (pageId === 'calendar-page') {
        const calendarBtn = document.querySelector('.nav-btn[onclick*="calendar-page"]');
        if (calendarBtn) calendarBtn.classList.add('active');
        if (typeof calendarViewYear === 'undefined') {
            initCalendarView();
        } else {
            renderCalendar();
        }
    } else if (pageId === 'companion-page') {
        const companionBtn = document.querySelector('.nav-btn[onclick*="companion-page"]');
        if (companionBtn) companionBtn.classList.add('active');
    } else if (pageId === 'directory-page' || pageId === 'place-page') {
        // Directory and place detail are sub-pages of Home
        const homeBtn = document.querySelector('.nav-btn[onclick*="home-page"]');
        if (homeBtn) homeBtn.classList.add('active');
    }
}

// Enhanced Slideshow Class
class EnhancedSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 10;
        this.slideWidth = 10; // Each slide is 10% of the 1000%-wide track (= 100% of viewport)
        this.isPlaying = true;
        this.autoPlayInterval = null;
        
        this.slidesTrack = document.getElementById('enhancedSlidesTrack');
        this.navDots = document.querySelectorAll('.nav-dot');
        
        this.init();
    }
    
    init() {
        if (!this.slidesTrack) return;
        
        // Set up navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Set up touch/swipe support
        this.setupTouchEvents();
        
        // Start autoplay
        this.startAutoPlay();
        
        // Pause on hover
        const slideshowContainer = document.querySelector('.enhanced-slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            slideshowContainer.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        }
    }
    
    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.slidesTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        this.slidesTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.slidesTrack.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.resumeAutoPlay();
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlidePosition();
        this.updateNavDots();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlidePosition();
        this.updateNavDots();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlidePosition();
        this.updateNavDots();
    }
    
    updateSlidePosition() {
        if (!this.slidesTrack) return;
        const offset = -this.currentSlide * this.slideWidth;
        this.slidesTrack.style.transform = `translateX(${offset}%)`;
        this.slidesTrack.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    updateNavDots() {
        this.navDots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    startAutoPlay() {
        // Clear any existing interval first
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) {
                this.nextSlide();
            }
        }, 3000); // Changed from 4000 to 3000 ms for faster slides
    }

    pauseAutoPlay() {
        this.isPlaying = false;
    }
    
    resumeAutoPlay() {
        this.isPlaying = true;
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isPlaying = false;
    }
}

// Sign in form handling
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Load translations first
    loadTranslations();
    
    // Initialize enhanced slideshow only if we're on the home page
    if (document.getElementById('home-page').classList.contains('active')) {
        window.enhancedSlideshow = new EnhancedSlideshow();
    }
    
    const signinForm = document.querySelector('.signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                // Simulate sign in process
                showPage('welcome-page');
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Voice button functionality for companion page
    const voiceBtn = document.querySelector(".voice-btn");
    if (voiceBtn) {
        // Select the icons by their new classes
        const playIcon = voiceBtn.querySelector(".play-icon");
        const pauseIcon = voiceBtn.querySelector(".pause-icon");
        const waveBars = document.querySelectorAll(".wave-bar");

        voiceBtn.addEventListener("click", function () {
            const avatarVideo = document.querySelector(".avatar-waving-video");
            if (!avatarVideo) return;

            // Check if the play icon is currently visible
            if (playIcon.style.display !== "none") {
                // HIDE play icon, SHOW pause icon
                playIcon.style.display = "none";
                pauseIcon.style.display = "block";

                // Change video to auntie nodding
                avatarVideo.src = "videos/Auntie_nodding.mp4";
                if (avatarVideo.querySelector("source")) {
                    avatarVideo.querySelector("source").src = "videos/Auntie_nodding.mp4";
                }
                avatarVideo.load(); // Reload the video to apply the new source
                avatarVideo.play();
                avatarVideo.currentTime = 0; // Ensure video starts from the beginning

                // Start wave animation
                waveBars.forEach(bar => {
                    bar.style.animationPlayState = "running";
                });
            } else {
                // SHOW play icon, HIDE pause icon
                playIcon.style.display = "block";
                pauseIcon.style.display = "none";

                // Change video back to auntie waving
                avatarVideo.src = "videos/Auntie_waving.mp4";
                if (avatarVideo.querySelector("source")) {
                    avatarVideo.querySelector("source").src = "videos/Auntie_waving.mp4";
                }
                avatarVideo.load(); // Reload the video to apply the new source
                avatarVideo.play();
                avatarVideo.currentTime = 0; // Ensure video starts from the beginning

                // Pause wave animation
                waveBars.forEach(bar => {
                    bar.style.animationPlayState = "paused";
                });
            }
        });
    }
    
    // Calendar functionality
    generateCalendar();
    
    // Add keyboard navigation for slideshow
    document.addEventListener('keydown', function(e) {
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === 'home-page') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                enhancedSlideshow.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                enhancedSlideshow.nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                if (enhancedSlideshow.isPlaying) {
                    enhancedSlideshow.pauseAutoPlay();
                } else {
                    enhancedSlideshow.resumeAutoPlay();
                }
            }
        }
    });
    
    // Add intersection observer for performance
    if ('IntersectionObserver' in window) {
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        const slides = document.querySelectorAll('.enhanced-news-slide');
        slides.forEach(slide => {
            slideObserver.observe(slide);
        });
    }
    
    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation for slideshow
    const slideshowContainer = document.querySelector('.enhanced-slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.style.opacity = '0';
        slideshowContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            slideshowContainer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            slideshowContainer.style.opacity = '1';
            slideshowContainer.style.transform = 'translateY(0)';
        }, 300);
    }
});

// ===== Event data =====
// Master record of every event. Dates are ISO (YYYY-MM-DD).
const eventsData = {
    fitness: {
        title: "Keep Fit @ Our Tampines Hub",
        image: "images/fitness.jpg",
        categoryLabel: "Fitness",
        categoryClass: "fitness",
        date: "2026-05-23",
        dateDisplay: "April to June",
        time: "9.00am – 10.00am",
        location: "Our Tampines Hub, Gate 1",
        register: "",
        description: "Stay active and improve your overall well-being. Join in to keep fit at Our Tampines Hub Gate 1!\n\nThere are workouts of various intensity levels to suit everyone. No pre-registrations required.\n\nImportant to note:\n• Entry will be granted on first-come, first-served basis within the barricaded workout area with permissible capacity of not more than 35 participants without sports equipment and 20 with sports equipment.\n• Please DO NOT RESERVE a space or spot in and outside the exercise area with personal items or towels. Unattended items will be removed.\n• Admission will be denied after the start of the session. This is to prevent any sports injury due to lack of proper warm-up, missing out on pre-session safety briefing by the instructor, and to prevent disruption to the on-going session.\n• All participants are required to be in proper sports attire to prevent injury. Those not suitably attired may be turned away.\n• Proper equipment to be used for the sports (e.g. yoga mat) to prevent injuries. Those without personal equipment for the sport will be turned away.\n• Please refrain from attending the workout if you are feeling unwell.\n• Be respectful to others when sharing a public space at the workout sessions.\n\nOur Tampines Hub (OTH) reserves the rights to change or cancel the programme or session without assigning reason. OTH will use reasonable efforts to provide advance notice of such a cancellation.\n\nThank you for your understanding and enjoy the sessions! Always Something for Everyone!\n#OurTampinesHub #TakeMe2OTH #Fitness"
    },
    wicked: {
        title: "Tampines Changkat Movie Screening: Wicked",
        image: "images/movie.jpg",
        categoryLabel: "Movie",
        categoryClass: "lifestyle",
        date: "2026-05-23",
        dateDisplay: "Saturday, 30 May 2026",
        time: "Evening",
        location: "Tampines Changkat CC",
        register: "go.gov.sg/tckmcmay26",
        description: "Tampines Changkat Movie Screening ✨🎬\n\nJoin us for a magical movie night featuring \"Wicked\" on the big screen! 💚🩷\n\nBring your family and friends for an evening of fun, laughter and community bonding at Tampines Changkat CC. Sit back, relax and enjoy the show together! 🍿\n\n🎟️ Register via the QR code or link below."
    },
    grandpaOx: {
        title: "The Girl, Grandpa and Ox",
        image: "images/stories.jpg",
        categoryLabel: "Storytelling",
        categoryClass: "community",
        date: "2026-05-23",
        dateDisplay: "Saturday, 23 May 2026",
        time: "6.00pm – 7.00pm",
        location: "OTH Wellness Garden, Level 5",
        register: "",
        description: "Grand-daughter and Grandpa set off, on foot, to sell their Ox at the faraway market. On the way, they pass strangers who give them opposite ideas on how to travel, which is both confusing and hilarious. The question is, will the three of them safely arrive at the market?\n\nAlways Something for Everyone!"
    },
    familySports: {
        title: "Family Sports Day @ Tampines Parkview",
        image: "images/familysportsday.jpg",
        categoryLabel: "Family",
        categoryClass: "health",
        date: "2026-05-30",
        dateDisplay: "Saturday, 30 May 2026",
        time: "10.00am – 2.00pm",
        location: "SPACE @ Our Tampines Hub, Level 2",
        register: "https://go.gov.sg/pvfamilysports",
        description: "An event for both Parents and Children!\n\n𝐓𝐚𝐦𝐩𝐢𝐧𝐞𝐬 𝐏𝐚𝐫𝐤𝐯𝐢𝐞𝐰 𝐑𝐍 invites you to our 𝐅𝐚𝐦𝐢𝐥𝐲 𝐒𝐩𝐨𝐫𝐭𝐬 𝐃𝐚𝐲 – a fun-packed afternoon designed for parents and children to get active and make memories together, bonding through the joy of play! 🏆\n\n𝐖𝐡𝐚𝐭'𝐬 𝐢𝐧 𝐬𝐭𝐨𝐫𝐞:\n🏋️ Mass Workout\n🎯 Target Toss Challenge\n🧱 Jenga Challenge\n🏃 Mini Sports\n🚧 Mini Obstacle Course\n\nPlus, walk away with FREE goodie bags and stand a chance to win at our Lucky Draw!\n\nAll this for just $2 per pax – don't miss out! Scan the QR code on the poster or visit the link below to register. See you there! 🎉"
    },
    streetDance: {
        title: "Chinese Street Dance Competition 2026 — Grand Finals",
        image: "images/chinesestreetdance.jpg",
        categoryLabel: "Dance",
        categoryClass: "entertainment",
        date: "2026-05-23",
        dateDisplay: "Saturday, 23 May 2026",
        time: "2.00pm",
        location: "Our Tampines Hub",
        register: "",
        description: "Get ready to bring the heat and the beats! 🕺🔥\n\n爱上华文街舞比赛 Chinese Street Dance Competition 2026 is heading to its Grand Finals right here at Our Tampines Hub on 23 May 2026 @ 2pm. You definitely don't want to miss the high-octane energy brought to you by students from various secondary schools.\n\nWhether you're coming to scream for your favorite team or just looking for some weekend \"positive energy\" (正能量), this is one weekend event you can't afford to miss."
    },
    ltaTalk: {
        title: "New PMA Regulations – What should I know?",
        image: "images/LTAtalk.jpg",
        categoryLabel: "Education",
        categoryClass: "technology",
        date: "2026-05-28",
        dateDisplay: "Tuesday, 26 May 2026",
        time: "TBA",
        location: "ESH@Tampines",
        register: "https://bit.ly/4dlRcAD",
        description: "Are you a PMA user or supporting someone who uses one? Join us for an informative session organised by ESH@Tampines in collaboration with the Land Transport Authority (LTA) to better understand Singapore's latest PMA regulations and what they mean for PMA users and caregivers.\n\nThe session will cover:\n• New PMA speed limit regulations\n• When the new regulations will take effect\n• Medical certification requirements for mobility scooter users\n• Safe and responsible PMA usage on public paths\n\nAs the regulations will progressively take effect from the second half of 2026 onwards, this session aims to help you better understand the upcoming changes, prepare early, and clarify any concerns you may have.\n\nSeats are limited, so register today at the link below!"
    },
    manga: {
        title: "Basic Manga Art (June Holidays)",
        image: "images/manga.jpg",
        categoryLabel: "Workshop",
        categoryClass: "technology",
        date: "2026-06-01",
        dateDisplay: "June 2026 School Holidays",
        time: "8 sessions",
        location: "Tampines North",
        register: "https://www.onepa.gov.sg/courses/basic-manga-art-c027215286",
        description: "This June school holidays, give your child a creative adventure they'll never forget! 🎨✨\n\nEnrol them in Tampines North's fun-filled Basic Manga Art course and watch their imagination come to life over 8 exciting sessions, where they'll learn the basics of drawing their very own manga characters from scratch! 🖊️📖\n\nWhether your child is a budding artist or just looking to try something new, this is the perfect opportunity to explore their creativity and make lasting memories with friends! 👫🎉\n\nSpots are limited and filling up fast, so don't wait too long!\n#WeLoveTampinesNorth"
    },
    plushie: {
        title: "Make A Plushie Workshop",
        image: "images/plushie.jpg",
        categoryLabel: "Workshop",
        categoryClass: "lifestyle",
        date: "2026-06-08",
        dateDisplay: "June 2026 School Holidays",
        time: "TBA",
        location: "Tampines North",
        register: "https://www.onepa.gov.sg/courses/make-a-plushie-c027213992",
        description: "Top off your June holidays with a super adorable Make A Plushie Workshop! 🧸💜\n\nYour child will get to craft and bring home their very own handmade plushie. A perfect creative session for kids to explore their imagination and make lasting memories with friends! 👫🎉\n\nSpots are limited and filling up fast, so don't wait too long!\n#WeLoveTampinesNorth"
    },
    crochet: {
        title: "Crochet Your Own Flower",
        image: "images/crochet.jpg",
        categoryLabel: "Workshop",
        categoryClass: "lifestyle",
        date: "2026-05-24",
        dateDisplay: "Sunday, 24 May 2026",
        time: "10.00am – 11.00am",
        location: "Function Room 2, Level 4 — OTH",
        register: "https://go.gov.sg/crocheting24may",
        description: "Come and experience the art of crochet by creating your own beautiful flower.\n\nAll materials are provided, along with step-by-step instructions and guidance. Perfect for beginners and craft lovers alike, this hands-on session lets you relax, learn a new skill, and leave with a handmade piece to cherish.\n\nSign up with the QR code on the poster or the link below.\n\nAlways Something for Everyone!\n#OurTampinesHub #TakeMe2OTH"
    },
    sachet: {
        title: "Scented Sachet Making (Therapeutic Series)",
        image: "images/sachet.jpg",
        categoryLabel: "Wellness",
        categoryClass: "health",
        date: "2026-05-23",
        dateDisplay: "Saturday, 23 May 2026",
        time: "8.30am – 9.30am",
        location: "OTH Wellness Garden, Level 5",
        register: "https://go.gov.sg/pressedflower23may",
        description: "Join us in our Therapeutic series and enjoy a mindful garden walk, while crafting scented sachets with dried flowers and herbs. They are perfect for relaxation, easing fatigue, and better sleep.\n\nCreate your own aromatic blend and bring tranquillity home, and experience self-care through nature's gentle gifts.\n\nSign up with the QR code on the poster or the link below.\n\nAlways Something for Everyone!\n#OurTampinesHub #TakeMe2OTH"
    }
};

// ===== Event Detail Modal =====
let currentModalEventId = null;

function openEventModal(eventId) {
    const ev = eventsData[eventId];
    if (!ev) return;
    currentModalEventId = eventId;

    document.getElementById('eventModalImage').src = ev.image;
    document.getElementById('eventModalImage').alt = ev.title;
    document.getElementById('eventModalTitle').textContent = ev.title;
    document.getElementById('eventModalDate').textContent = ev.dateDisplay || '';
    document.getElementById('eventModalTime').textContent = ev.time || '';
    document.getElementById('eventModalLocation').textContent = ev.location || '';
    document.getElementById('eventModalDescription').textContent = ev.description || '';
    const regEl = document.getElementById('eventModalRegister');
    regEl.textContent = ev.register ? ('🎟️ Register: ' + ev.register) : '';

    // Update Add to Calendar button state
    const addBtn = document.getElementById('eventModalAddBtn');
    const inCal = getMyCalendarEvents().some(e => e.eventId === eventId);
    if (inCal) {
        addBtn.classList.add('added');
        addBtn.querySelector('.add-label').textContent = 'Added to Calendar';
        addBtn.querySelector('.add-icon').textContent = '✓';
    } else {
        addBtn.classList.remove('added');
        addBtn.querySelector('.add-label').textContent = 'Add to Calendar';
        addBtn.querySelector('.add-icon').textContent = '＋';
    }

    document.getElementById('eventModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    document.body.style.overflow = '';
    currentModalEventId = null;
}

// ===== My Calendar (localStorage-backed) =====
function getMyCalendarEvents() {
    try {
        return JSON.parse(localStorage.getItem('myCalendarEvents') || '[]');
    } catch (e) {
        return [];
    }
}

function saveMyCalendarEvents(events) {
    localStorage.setItem('myCalendarEvents', JSON.stringify(events));
}

function addCurrentEventToCalendar() {
    if (!currentModalEventId) return;
    const eventId = currentModalEventId;
    const events = getMyCalendarEvents();
    if (events.some(e => e.eventId === eventId)) return; // already added
    events.push({ eventId, important: false });
    saveMyCalendarEvents(events);

    const addBtn = document.getElementById('eventModalAddBtn');
    addBtn.classList.add('added');
    addBtn.querySelector('.add-label').textContent = 'Added to Calendar';
    addBtn.querySelector('.add-icon').textContent = '✓';
}

// ===== Calendar rendering =====
let calendarViewYear;
let calendarViewMonth; // 0-indexed

function initCalendarView() {
    const now = new Date();
    calendarViewYear = now.getFullYear();
    calendarViewMonth = now.getMonth();
    renderCalendar();

    const prev = document.getElementById('prevMonthBtn');
    const next = document.getElementById('nextMonthBtn');
    if (prev) prev.onclick = () => {
        calendarViewMonth--;
        if (calendarViewMonth < 0) { calendarViewMonth = 11; calendarViewYear--; }
        renderCalendar();
    };
    if (next) next.onclick = () => {
        calendarViewMonth++;
        if (calendarViewMonth > 11) { calendarViewMonth = 0; calendarViewYear++; }
        renderCalendar();
    };
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const label = document.getElementById('monthYearLabel');
    if (!grid || !label) return;

    // Keep day-of-week headers, remove existing day cells
    grid.querySelectorAll('.calendar-day').forEach(d => d.remove());

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    label.textContent = `${monthNames[calendarViewMonth]} ${calendarViewYear}`;

    const firstDay = new Date(calendarViewYear, calendarViewMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();

    // Empty cells before the 1st
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        grid.appendChild(empty);
    }

    const myEvents = getMyCalendarEvents();
    const today = new Date();
    const isViewingCurrentMonth =
        today.getFullYear() === calendarViewYear && today.getMonth() === calendarViewMonth;

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = day;

        if (isViewingCurrentMonth && day === today.getDate()) {
            cell.classList.add('today');
        }

        const iso = `${calendarViewYear}-${String(calendarViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = myEvents.filter(e => (eventsData[e.eventId] || {}).date === iso);
        if (dayEvents.length > 0) {
            cell.classList.add('has-events');
            if (dayEvents.some(e => e.important)) {
                cell.classList.add('has-important');
            }
        }

        cell.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            cell.classList.add('selected');
            showDayEvents(iso, day);
        });

        grid.appendChild(cell);
    }

    // Hide events panel on re-render until a day is clicked
    const panel = document.getElementById('dayEventsPanel');
    if (panel) panel.style.display = 'none';
}

function showDayEvents(iso, day) {
    const panel = document.getElementById('dayEventsPanel');
    const list = document.getElementById('dayEventsList');
    const title = document.getElementById('dayEventsTitle');
    if (!panel || !list || !title) return;

    const myEvents = getMyCalendarEvents();
    const dayEvents = myEvents.filter(e => (eventsData[e.eventId] || {}).date === iso);

    if (dayEvents.length === 0) {
        panel.style.display = 'none';
        return;
    }

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    title.textContent = `Events on ${day} ${monthNames[calendarViewMonth]} ${calendarViewYear}`;

    list.innerHTML = '';
    dayEvents.forEach(entry => {
        const ev = eventsData[entry.eventId];
        if (!ev) return;
        const item = document.createElement('div');
        item.className = 'day-event-item' + (entry.important ? ' important' : '');
        item.innerHTML = `
            <img class="day-event-thumb" src="${ev.image}" alt="">
            <div class="day-event-info">
                <div class="day-event-title">${ev.title}</div>
                <div class="day-event-time">${ev.time || ''}</div>
            </div>
            ${entry.important ? '<span class="day-event-star">★</span>' : ''}
        `;
        item.addEventListener('click', () => openCalendarEventModal(entry.eventId));
        list.appendChild(item);
    });

    panel.style.display = 'block';
}

// ===== Calendar Event Action Modal (remove / important / view) =====
let currentCalendarEventId = null;

function openCalendarEventModal(eventId) {
    currentCalendarEventId = eventId;
    const ev = eventsData[eventId];
    if (!ev) return;
    document.getElementById('calendarEventModalTitle').textContent = ev.title;

    // Update Important button state
    const myEvents = getMyCalendarEvents();
    const entry = myEvents.find(e => e.eventId === eventId);
    const importantBtn = document.querySelector('#calendarEventModal .important-btn');
    const importantLabel = document.getElementById('importantBtnLabel');
    if (entry && entry.important) {
        importantBtn.classList.add('active');
        importantLabel.textContent = 'Unmark Important';
    } else {
        importantBtn.classList.remove('active');
        importantLabel.textContent = 'Mark as Important';
    }

    document.getElementById('calendarEventModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCalendarEventModal() {
    document.getElementById('calendarEventModal').style.display = 'none';
    document.body.style.overflow = '';
    currentCalendarEventId = null;
}

function toggleCalendarEventImportant() {
    if (!currentCalendarEventId) return;
    const events = getMyCalendarEvents();
    const entry = events.find(e => e.eventId === currentCalendarEventId);
    if (!entry) return;
    entry.important = !entry.important;
    saveMyCalendarEvents(events);
    closeCalendarEventModal();
    renderCalendar();
    // Re-open the day's events list for the affected date
    const ev = eventsData[currentCalendarEventId];
    if (ev && ev.date) {
        const [y, m, d] = ev.date.split('-').map(Number);
        if (y === calendarViewYear && (m - 1) === calendarViewMonth) {
            showDayEvents(ev.date, d);
        }
    }
}

function removeCalendarEvent() {
    if (!currentCalendarEventId) return;
    const events = getMyCalendarEvents().filter(e => e.eventId !== currentCalendarEventId);
    saveMyCalendarEvents(events);
    const removedId = currentCalendarEventId;
    closeCalendarEventModal();
    renderCalendar();
    // Refresh day panel
    const ev = eventsData[removedId];
    if (ev && ev.date) {
        const [y, m, d] = ev.date.split('-').map(Number);
        if (y === calendarViewYear && (m - 1) === calendarViewMonth) {
            showDayEvents(ev.date, d);
        }
    }
}

function viewCalendarEventDetails() {
    const id = currentCalendarEventId;
    closeCalendarEventModal();
    if (id) openEventModal(id);
}

// Keep the legacy name so the old DOMContentLoaded call still works.
function generateCalendar() {
    initCalendarView();
}

// ===== Buddy AI Chatbot (server-backed) =====
// Buddy talks to the FastAPI backend at /api/chat, which runs the
// Digital OTH retrieval layer (Chroma + BM25 + RRF + LLM rerank) and
// composes the system prompt with the top-k matching services. The
// full Buddy persona, OTH knowledge, and language directive all live
// in main.py's build_system_prompt — the client only sends the
// conversation + the selected language.
const CHAT_ENDPOINT = "/api/chat";

let buddyChatHistory = [];

function addBuddyMessage(role, text, opts = {}) {
    const messagesEl = document.getElementById('buddyMessages');
    if (!messagesEl) return null;
    const bubble = document.createElement('div');
    const id = 'buddy-msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    bubble.id = id;
    bubble.className = 'buddy-msg buddy-msg-' + role + (opts.typing ? ' buddy-msg-typing' : '');
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return id;
}

// Call the FastAPI /api/chat endpoint. The history is stored internally
// in OpenAI's {role: 'user'|'assistant', content} shape, which is what
// the backend's Pydantic ChatRequest expects. The selected language
// (set on the welcome page) is sent as a sibling field so main.py can
// inject the corresponding directive into its server-side prompt.
async function callBackend(userText) {
    buddyChatHistory.push({ role: 'user', content: userText });

    const body = {
        messages: buddyChatHistory,
        language: currentLanguage || 'en',
    };

    const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Chat API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data?.reply;
    if (!reply) throw new Error('Empty reply from /api/chat');
    buddyChatHistory.push({ role: 'assistant', content: reply });
    return { reply, services: Array.isArray(data?.services) ? data.services : [] };
}

async function sendBuddyMessage(userText) {
    if (!userText || !userText.trim()) return;
    userText = userText.trim();

    // If Buddy is still speaking the previous reply, hush her — the user is
    // moving on. Stays in sync with the new reply we're about to fetch.
    stopCurrentBuddySpeech();

    addBuddyMessage('user', userText);
    const typingId = addBuddyMessage('assistant', 'Buddy is typing…', { typing: true });

    try {
        const { reply, services } = await callBackend(userText);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        addBuddyMessage('assistant', reply);
        if (services && services.length > 0) {
            addBuddyRoadmap(services);
        }
        // Speak the textual reply only — the roadmap is visual and would be
        // tedious read aloud. ElevenLabs first, browser TTS as fallback.
        speakBuddyReply(reply);
    } catch (err) {
        console.error('Buddy error:', err);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        addBuddyMessage('assistant', "⚠️ Buddy hit an error:\n" + (err.message || err) + "\n\n(Press F12 → Console for full details.)");
    }
}

// ===== Buddy Roadmap UI =====
// Each retrieved service from /api/chat becomes a numbered step card.
// Cards expose two actions: Face-to-face (info modal) and Online (form modal).
// Service objects are stashed on the button via a per-card closure so we
// don't have to round-trip JSON through data attributes.

function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function shortLocation(service) {
    // For Physical_OTH services the oth_location starts with a level/unit;
    // for Digital_Hotline services it starts with "No counter at OTH...".
    // Show a short label for the card.
    if (service.location_type === 'Physical_OTH') {
        const first = (service.oth_location || '').split(/[.;]/)[0].trim();
        return first || 'At Our Tampines Hub';
    }
    return 'Online or by hotline';
}

function addBuddyRoadmap(services) {
    const messagesEl = document.getElementById('buddyMessages');
    if (!messagesEl) return;

    const wrap = document.createElement('div');
    wrap.className = 'buddy-roadmap';

    services.forEach((service, i) => {
        const step = document.createElement('div');
        step.className = 'roadmap-step';

        const dot = document.createElement('div');
        dot.className = 'roadmap-dot';
        dot.textContent = String(i + 1);

        const card = document.createElement('div');
        card.className = 'roadmap-card';
        const isPhysical = service.location_type === 'Physical_OTH';
        card.innerHTML = `
            <div class="roadmap-card-head">
                <div class="roadmap-title">${escapeHtml(service.service_name)}</div>
                <div class="roadmap-tag roadmap-tag-${isPhysical ? 'physical' : 'digital'}">${isPhysical ? 'At OTH' : 'Online / Hotline'}</div>
            </div>
            <div class="roadmap-agency">${escapeHtml(service.agency)}</div>
            <div class="roadmap-loc">📍 ${escapeHtml(shortLocation(service))}</div>
            <div class="roadmap-actions">
                <button type="button" class="roadmap-btn roadmap-btn-ftf">Face-to-face</button>
                <button type="button" class="roadmap-btn roadmap-btn-online">Online</button>
            </div>
        `;
        card.querySelector('.roadmap-btn-ftf').addEventListener('click', () => openFtfModal(service));
        card.querySelector('.roadmap-btn-online').addEventListener('click', () => openOnlineModal(service));

        step.appendChild(dot);
        step.appendChild(card);
        wrap.appendChild(step);
    });

    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ===== Buddy Service Modals =====
// One modal element lives at the bottom of <body>. openFtfModal /
// openOnlineModal swap its inner content; closeBuddyModal hides it.

function ensureBuddyModal() {
    let modal = document.getElementById('buddyModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'buddyModal';
    modal.className = 'buddy-modal-overlay';
    modal.innerHTML = `
        <div class="buddy-modal" role="dialog" aria-modal="true">
            <button type="button" class="buddy-modal-close" aria-label="Close">×</button>
            <div class="buddy-modal-body"></div>
        </div>
    `;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeBuddyModal();
    });
    modal.querySelector('.buddy-modal-close').addEventListener('click', closeBuddyModal);
    document.body.appendChild(modal);
    return modal;
}

function openBuddyModal(innerHtml, onMount) {
    const modal = ensureBuddyModal();
    const body = modal.querySelector('.buddy-modal-body');
    body.innerHTML = innerHtml;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (typeof onMount === 'function') onMount(body);
}

function closeBuddyModal() {
    const modal = document.getElementById('buddyModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
}

function formatHours(hours) {
    if (!hours || typeof hours !== 'object') return '';
    const entries = Object.entries(hours);
    if (entries.length === 0) return '';
    return entries.map(([k, v]) => `<div class="hours-row"><span class="hours-key">${escapeHtml(k)}</span><span class="hours-val">${escapeHtml(v)}</span></div>`).join('');
}

function formatDocs(docs) {
    if (!Array.isArray(docs) || docs.length === 0) return '<div class="modal-empty">No documents required.</div>';
    return docs.map(d => {
        const cond = d.required_if ? ` <span class="doc-cond">(${escapeHtml(d.required_if)})</span>` : '';
        const notes = d.notes ? `<div class="doc-notes">${escapeHtml(d.notes)}</div>` : '';
        return `<li class="doc-item"><div class="doc-name">${escapeHtml(d.name)}${cond}</div>${notes}</li>`;
    }).join('');
}

function openFtfModal(service) {
    const accept = service.walk_in_accepted ? 'Walk-in accepted' : 'Walk-in not accepted';
    const appt = service.appointment_required ? 'Appointment required' : 'No appointment needed';
    openBuddyModal(`
        <div class="modal-eyebrow">Face-to-face · ${escapeHtml(service.agency)}</div>
        <h2 class="modal-title">${escapeHtml(service.service_name)}</h2>
        <div class="modal-section">
            <div class="modal-section-title">Where at OTH</div>
            <div class="modal-section-body">${escapeHtml(service.oth_location || '—')}</div>
        </div>
        <div class="modal-section">
            <div class="modal-section-title">Opening hours</div>
            <div class="modal-section-body modal-hours">${formatHours(service.operating_hours)}</div>
        </div>
        <div class="modal-section">
            <div class="modal-section-title">What to bring</div>
            <ul class="modal-section-body modal-docs">${formatDocs(service.required_documents)}</ul>
        </div>
        <div class="modal-chip-row">
            <span class="modal-chip">${escapeHtml(accept)}</span>
            <span class="modal-chip">${escapeHtml(appt)}</span>
            <span class="modal-chip">~ ${escapeHtml(service.typical_processing_time || 'processing time varies')}</span>
        </div>
        <div class="modal-actions">
            <button type="button" class="modal-btn modal-btn-primary" data-close>Got it</button>
        </div>
    `, (body) => {
        body.querySelector('[data-close]').addEventListener('click', closeBuddyModal);
    });
}

function openOnlineModal(service) {
    // No mock form. The official site is the source of truth — we embed it
    // and always expose an "Open in a new tab" anchor as the reliable path
    // since most .gov.sg pages set X-Frame-Options: DENY and refuse to load
    // inside an iframe. The 3-second load-watch reveals a helper hint when
    // the iframe stays blank, so users know to use the new-tab anchor.
    if (!service.website) {
        const phoneHtml = service.phone ? `<a class="modal-link" href="tel:${escapeHtml(service.phone)}">${escapeHtml(service.phone)}</a>` : '<span class="modal-muted">No hotline listed</span>';
        openBuddyModal(`
            <div class="modal-eyebrow">Online · ${escapeHtml(service.agency)}</div>
            <h2 class="modal-title">${escapeHtml(service.service_name)}</h2>
            <p class="modal-lede">This service doesn't have an online portal — reach the team directly by phone.</p>
            <div class="online-hotline-card">
                <div class="online-hotline-label">Service hotline</div>
                <div class="online-hotline-value">${phoneHtml}</div>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn modal-btn-primary" data-close>Got it</button>
            </div>
        `, (body) => {
            body.querySelector('[data-close]').addEventListener('click', closeBuddyModal);
        });
        return;
    }

    const url = service.website;
    openBuddyModal(`
        <div class="modal-eyebrow">Online · ${escapeHtml(service.agency)}</div>
        <h2 class="modal-title">${escapeHtml(service.service_name)}</h2>
        <p class="modal-lede">This is the official ${escapeHtml(service.agency)} page. Your details go straight to them — nothing passes through us.</p>
        <div class="online-frame-wrap">
            <iframe class="online-frame"
                src="${escapeHtml(url)}"
                sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                referrerpolicy="no-referrer"
                loading="lazy"
                title="${escapeHtml(service.service_name)} — official site"></iframe>
            <div class="online-frame-hint" hidden>
                If the page above is blank, ${escapeHtml(service.agency)} blocks embedding — tap <strong>Open the official site</strong> below to continue on gov.sg.
            </div>
        </div>
        <div class="online-frame-url">${escapeHtml(url)}</div>
        <div class="modal-actions">
            <button type="button" class="modal-btn modal-btn-ghost" data-close>Close</button>
            <a class="modal-btn modal-btn-primary modal-btn-link"
               href="${escapeHtml(url)}"
               target="_blank"
               rel="noopener">Open the official site ↗</a>
        </div>
    `, (body) => {
        body.querySelector('[data-close]').addEventListener('click', closeBuddyModal);
        const frame = body.querySelector('.online-frame');
        const hint = body.querySelector('.online-frame-hint');
        let loaded = false;
        frame.addEventListener('load', () => { loaded = true; });
        setTimeout(() => {
            if (!loaded && hint) hint.hidden = false;
        }, 3000);
    });
}

function sendBuddyForm(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('buddyTextInput');
    if (!input) return;
    const text = input.value;
    input.value = '';
    sendBuddyMessage(text);
}

// ===== Buddy Voice Output (ElevenLabs TTS via /api/tts, browser fallback) =====
// The backend tries ElevenLabs first. Per main.py, /api/tts returns:
//   200 + audio/mpeg → play the MP3 directly.
//   503             → ELEVENLABS_API_KEY not set; silently fall back to
//                     window.speechSynthesis so Buddy still has a voice.
//   502             → ElevenLabs errored; also fall back silently.
// We hold the playing Audio so a fresh reply cancels the previous one.

let currentBuddyAudio = null;
// User-controlled. Default ON; tap the speaker icon in the Buddy header to
// flip. Persisted across reloads so the demo respects the user's choice.
let buddyVoiceOn = (() => {
    try {
        const saved = localStorage.getItem('buddyVoiceOn');
        return saved === null ? true : saved === 'true';
    } catch (_) { return true; }
})();

function renderBuddyVoiceToggle() {
    const btn = document.getElementById('buddyVoiceToggle');
    if (!btn) return;
    btn.classList.toggle('is-muted', !buddyVoiceOn);
    btn.setAttribute('aria-pressed', String(buddyVoiceOn));
    btn.setAttribute('aria-label', buddyVoiceOn ? 'Buddy speaks replies — tap to mute' : 'Buddy is muted — tap to enable voice replies');
    btn.textContent = buddyVoiceOn ? '🔊' : '🔇';
}

function toggleBuddyVoiceOutput() {
    buddyVoiceOn = !buddyVoiceOn;
    try { localStorage.setItem('buddyVoiceOn', String(buddyVoiceOn)); } catch (_) {}
    if (!buddyVoiceOn) stopCurrentBuddySpeech();
    renderBuddyVoiceToggle();
}

document.addEventListener('DOMContentLoaded', renderBuddyVoiceToggle);

function stopCurrentBuddySpeech() {
    if (currentBuddyAudio) {
        try { currentBuddyAudio.pause(); } catch (_) {}
        currentBuddyAudio.src = '';
        currentBuddyAudio = null;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// Modern OSes ship two tiers of voices through SpeechSynthesis: older
// robotic ones and newer neural ones. The neural ones have telltale words
// in `name`: "Natural" / "Online" / "Neural" (Windows 11), "Enhanced" /
// "Premium" / "Siri" (Mac/iOS), "Wavenet" (Chrome OS / Android). We filter
// for those first so Buddy doesn't sound like a 1990s phone tree.
function pickBuddyVoice() {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const isNeural = v => /natural|online|neural|enhanced|premium|wavenet|siri/i.test(v.name);
    const langPriority = (() => {
        if (currentLanguage === 'zh') return ['zh-SG', 'zh-CN', 'zh-TW', 'zh-HK'];
        if (currentLanguage === 'ms') return ['ms-MY', 'ms-SG', 'id-ID'];
        return ['en-SG', 'en-AU', 'en-GB', 'en-US', 'en-NZ'];
    })();

    // 1. Neural voice in a preferred Singapore-ish accent.
    for (const lang of langPriority) {
        const v = voices.find(x => x.lang === lang && isNeural(x));
        if (v) return v;
    }
    // 2. Any neural voice that matches the language prefix.
    const langPrefix = langPriority[0].split('-')[0];
    const anyNeural = voices.find(v => isNeural(v) && v.lang && v.lang.startsWith(langPrefix));
    if (anyNeural) return anyNeural;
    // 3. Any voice with one of our preferred accents (older / robotic).
    for (const lang of langPriority) {
        const v = voices.find(x => x.lang === lang);
        if (v) return v;
    }
    // 4. Any voice matching the language prefix, then anything.
    return voices.find(v => v.lang && v.lang.startsWith(langPrefix)) || voices[0];
}

function stripMarkdownForSpeech(text) {
    return text
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^#+\s*/gm, '')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n{2,}/g, '. ');
}

function speakWithBrowser(text) {
    if (!('speechSynthesis' in window)) return;
    const clean = stripMarkdownForSpeech(text);
    const utter = new SpeechSynthesisUtterance(clean);
    const v = pickBuddyVoice();
    if (v) { utter.voice = v; utter.lang = v.lang; }
    // 0.95 reads a touch slower than default — kinder to elderly listeners
    // and to anyone parsing a roadmap of step instructions.
    utter.rate = 0.95;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
}

// Voice list loads asynchronously on most browsers. Touch it once at boot
// so the first Buddy reply doesn't default to the robotic system voice.
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { /* triggers cache load */ };
}

async function speakBuddyReply(text) {
    if (!buddyVoiceOn || !text) return;
    stopCurrentBuddySpeech();

    // Strip markdown so neither ElevenLabs nor the browser voice reads
    // bullet asterisks, code fences, or hash headers out loud. Backend
    // caps at 8000 chars; trim defensively (roadmap replies are short).
    const speakText = stripMarkdownForSpeech(text).trim().slice(0, 7900);

    try {
        const resp = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: speakText }),
        });
        if (resp.ok) {
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            currentBuddyAudio = audio;
            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(url);
                if (currentBuddyAudio === audio) currentBuddyAudio = null;
            });
            audio.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                if (currentBuddyAudio === audio) currentBuddyAudio = null;
                speakWithBrowser(speakText);
            });
            try {
                await audio.play();
                // Chrome can resolve audio.play() but immediately pause if
                // user activation expired (silent autoplay block — no error
                // event). Sanity-check after a tick; if it didn't start,
                // fall through to speechSynthesis which is more permissive.
                await new Promise(r => setTimeout(r, 150));
                if (audio.paused && audio.currentTime === 0) {
                    console.warn('Audio playback was silently blocked, falling back to speechSynthesis');
                    URL.revokeObjectURL(url);
                    if (currentBuddyAudio === audio) currentBuddyAudio = null;
                    speakWithBrowser(speakText);
                }
            } catch (e) {
                console.warn('audio.play() rejected, falling back:', e);
                URL.revokeObjectURL(url);
                if (currentBuddyAudio === audio) currentBuddyAudio = null;
                speakWithBrowser(speakText);
            }
            return;
        }
        // 503 (not configured) or 502 (ElevenLabs errored): silent fallback.
        speakWithBrowser(speakText);
    } catch (_) {
        // Network error reaching /api/tts — fall through to browser TTS.
        speakWithBrowser(speakText);
    }
}

// ===== Buddy Voice Input (MediaRecorder → /api/transcribe Whisper) =====
// We previously used Chrome's Web Speech API, but that depends on Google's
// cloud speech endpoint which corporate / public wifi (incl. typical
// Singapore school + hackathon networks) frequently blocks. Switched to
// MediaRecorder + the engineer's /api/transcribe Whisper proxy so all the
// network traffic flows through our own backend — same path the chat
// already uses, so if the chat works, the mic works.
//
// Silence detection runs locally via Web Audio API (no network), then we
// auto-stop and ship the audio to /api/transcribe. Result is filled into
// the input box and sent to /api/chat just like a typed message.

let buddyMediaRecorder = null;
let buddyAudioChunks = [];
let buddyAudioStream = null;
let buddyAudioContext = null;
let buddyAnalyser = null;
let buddyVadInterval = null;
let buddyIsListening = false;
let buddyLastSpeechAt = 0;
let buddyStoppedByUser = false;

// VAD tuning. The threshold is on the 0-255 byte-frequency scale; raise it
// if quiet rooms still auto-stop too late, lower it if soft speakers get
// cut off. SILENCE_MS is how long the audio must stay below threshold
// before we treat the user as done.
const BUDDY_VAD_THRESHOLD = 14;
const BUDDY_VAD_INTERVAL_MS = 100;
const BUDDY_SILENCE_MS = 4500;

// Chrome's autoplay policy ties Audio.play() and speechSynthesis.speak() to
// a recent user gesture (≈5 s grace). A voice round-trip (record → upload
// → Whisper → /api/chat → reply) often busts that window, so Buddy's TTS
// silently fails. Trick: prime both APIs synchronously inside the mic-tap
// click handler so they're considered "user-activated" for the whole turn.
function primeAudioForPlayback() {
    try {
        if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance('');
            u.volume = 0;
            window.speechSynthesis.speak(u);
            window.speechSynthesis.cancel();
        }
    } catch (_) {}
    try {
        // A tiny silent WAV (44 bytes) as a data URL. Playing it under user
        // activation unlocks <audio> playback for the rest of the gesture.
        if (!window._buddyAudioPrimer) {
            window._buddyAudioPrimer = new Audio(
                'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
            );
        }
        const a = window._buddyAudioPrimer;
        a.muted = true;
        const p = a.play();
        if (p && typeof p.then === 'function') p.catch(() => {});
    } catch (_) {}
}

async function toggleBuddyVoice() {
    const micBtn = document.getElementById('buddyMicBtn');
    const input = document.getElementById('buddyTextInput');

    // Already recording → user wants to stop early. Mark it intentional so
    // the recorder's onstop path doesn't double-fire confusing UX.
    if (buddyIsListening) {
        buddyStoppedByUser = true;
        stopBuddyRecording();
        return;
    }

    // We're inside a user-gesture handler — unlock TTS playback before the
    // gesture's autoplay grace expires during the recording / upload window.
    primeAudioForPlayback();

    // Browser capability gate.
    if (!navigator.mediaDevices || !window.MediaRecorder) {
        addBuddyMessage('assistant', "Sorry, your browser doesn't support audio recording. Please type your question, or try Chrome/Edge.");
        return;
    }

    // Acquire the mic. First call also surfaces the permission prompt.
    try {
        buddyAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
        if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
            addBuddyMessage('assistant', "I can't hear you — your browser blocked microphone access. Tap the padlock icon in the address bar to allow the mic, then try again. You can also type your question.");
        } else if (e && e.name === 'NotFoundError') {
            addBuddyMessage('assistant', "I couldn't find a microphone on this device. Please type your question instead.");
        } else {
            addBuddyMessage('assistant', `Couldn't start the microphone: ${e?.message || e}. Please type your question.`);
        }
        return;
    }

    buddyStoppedByUser = false;
    buddyAudioChunks = [];

    try {
        buddyMediaRecorder = new MediaRecorder(buddyAudioStream);
    } catch (e) {
        buddyAudioStream.getTracks().forEach(t => t.stop());
        buddyAudioStream = null;
        addBuddyMessage('assistant', `Couldn't start recording: ${e?.message || e}. Please type your question.`);
        return;
    }

    buddyMediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) buddyAudioChunks.push(e.data);
    };
    buddyMediaRecorder.onstop = onBuddyRecordingDone;
    buddyMediaRecorder.start();

    // Web Audio analyser for local silence detection — no network required,
    // unlike Web Speech API. We just sample the frequency data every 100 ms
    // and check the average byte amplitude.
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        buddyAudioContext = new AC();
        const source = buddyAudioContext.createMediaStreamSource(buddyAudioStream);
        buddyAnalyser = buddyAudioContext.createAnalyser();
        buddyAnalyser.fftSize = 1024;
        source.connect(buddyAnalyser);
    } catch (e) {
        // VAD failed — fall back to a hard 30-second cap so the recording
        // can't run forever. Better than nothing.
        console.warn('Web Audio VAD unavailable, using time cap only:', e);
        buddyAnalyser = null;
    }

    buddyIsListening = true;
    micBtn.classList.add('listening');
    input.placeholder = 'Listening… pause when you\'re done';
    buddyLastSpeechAt = Date.now();  // grace period — user might say "hi" right away

    const data = buddyAnalyser ? new Uint8Array(buddyAnalyser.frequencyBinCount) : null;
    const startedAt = Date.now();
    const HARD_CAP_MS = 60_000;  // never record longer than a minute

    buddyVadInterval = setInterval(() => {
        if (buddyAnalyser && data) {
            buddyAnalyser.getByteFrequencyData(data);
            // Average amplitude across the spectrum — simple but works
            // well enough to distinguish quiet rooms from speech.
            let sum = 0;
            for (let i = 0; i < data.length; i++) sum += data[i];
            const avg = sum / data.length;
            if (avg > BUDDY_VAD_THRESHOLD) {
                buddyLastSpeechAt = Date.now();
            }
        }
        const sinceSpeech = Date.now() - buddyLastSpeechAt;
        const sinceStart = Date.now() - startedAt;
        if (sinceSpeech > BUDDY_SILENCE_MS || sinceStart > HARD_CAP_MS) {
            stopBuddyRecording();
        }
    }, BUDDY_VAD_INTERVAL_MS);
}

function stopBuddyRecording() {
    if (buddyVadInterval) { clearInterval(buddyVadInterval); buddyVadInterval = null; }
    if (buddyMediaRecorder && buddyMediaRecorder.state !== 'inactive') {
        try { buddyMediaRecorder.stop(); } catch (_) {}
    }
}

async function onBuddyRecordingDone() {
    const micBtn = document.getElementById('buddyMicBtn');
    const input = document.getElementById('buddyTextInput');

    // Tear down audio resources first so the mic indicator goes away even
    // if the upload itself errors.
    if (buddyAudioStream) {
        buddyAudioStream.getTracks().forEach(t => t.stop());
        buddyAudioStream = null;
    }
    if (buddyAudioContext) {
        try { buddyAudioContext.close(); } catch (_) {}
        buddyAudioContext = null;
    }
    buddyAnalyser = null;
    buddyIsListening = false;

    const chunks = buddyAudioChunks;
    buddyAudioChunks = [];

    if (!chunks.length) {
        micBtn.classList.remove('listening');
        input.placeholder = 'Type your question...';
        return;
    }

    // Keep the pulse going through the transcribe call — it's a clear
    // signal that the system is still working on the user's input.
    input.placeholder = 'Transcribing…';

    const mime = buddyMediaRecorder?.mimeType || 'audio/webm';
    const blob = new Blob(chunks, { type: mime });
    const ext = mime.includes('mp4') ? 'mp4' : mime.includes('ogg') ? 'ogg' : 'webm';

    const fd = new FormData();
    fd.append('audio', blob, 'speech.' + ext);

    try {
        const resp = await fetch('/api/transcribe', { method: 'POST', body: fd });
        if (!resp.ok) {
            const errText = await resp.text();
            console.error('/api/transcribe error:', resp.status, errText);
            addBuddyMessage('assistant', `I couldn't transcribe that (server returned ${resp.status}). Please type your question.`);
            return;
        }
        const data = await resp.json();
        const text = (data?.text || '').trim();
        if (!text) {
            addBuddyMessage('assistant', "I didn't catch any speech in that recording. Tap the mic and try again, or type your question.");
            return;
        }
        input.value = '';
        sendBuddyMessage(text);
    } catch (e) {
        console.error('Transcribe network error:', e);
        addBuddyMessage('assistant', `Couldn't send your voice recording (${e?.message || e}). Please type your question.`);
    } finally {
        micBtn.classList.remove('listening');
        input.placeholder = 'Type your question...';
    }
}

// ===== Directory: place listings with ratings + reviews =====
// Mock-data directory of places at Our Tampines Hub, grouped by category.
// Healthcare entries use real Google data the user provided; other categories
// are simulated for the prototype.
const directoriesData = {
    healthcare: {
        title: { en: "Healthcare", zh: "医疗保健", ms: "Penjagaan Kesihatan" },
        subtitle: { en: "Clinics & pharmacies at Our Tampines Hub", zh: "淡滨尼天地的诊所与药房", ms: "Klinik & farmasi di Our Tampines Hub" },
        icon: "🏥",
        places: [
            {
                id: "ultimed",
                name: "Ultimed Medical Centre & Surgical Suites",
                icon: "🏥",
                image: "images/ultimedclinic.png",
                unit: "#05-31A",
                category: { en: "Medical centre", zh: "医疗中心", ms: "Pusat perubatan" },
                rating: 4.9,
                reviewsCount: 39,
                address: "1 Tampines Walk, #05-31A Our Tampines Hub, Singapore 528523",
                phone: "6592 2770",
                hours: { en: "Mon–Sat 9.00am – 5.30pm", zh: "周一至周六 上午9:00 – 下午5:30", ms: "Isnin–Sabtu 9.00 pagi – 5.30 petang" },
                tagline: { en: "Brand new clinic on Level 5, very clean and quiet.", zh: "位于5楼的全新诊所,环境干净安静。", ms: "Klinik baharu di Aras 5, sangat bersih dan tenang." },
                reviews: [
                    { author: "Anna Shmeleva", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 5, text: { en: "Brand new clinic on the 5th floor of OTH. Clean and bright, with water/tea/coffee facilities and no crowds. Visited with my child for an emergency — my son had hurt his leg badly. Very happy and grateful for the care.", zh: "淡滨尼天地5楼的全新诊所,明亮整洁,提供饮水、茶、咖啡,人也不多。带儿子来看急诊,他腿伤得很重。非常满意,感谢医护人员的照顾。", ms: "Klinik baharu di tingkat 5 OTH. Bersih dan terang, ada kemudahan air/teh/kopi dan tidak sesak. Bawa anak saya untuk kecemasan — kakinya cedera teruk. Sangat puas hati dan berterima kasih atas penjagaan." } },
                    { author: "Nguyen Uyen", time: { en: "6 months ago", zh: "6个月前", ms: "6 bulan lalu" }, rating: 5, text: { en: "Registered my family for vaccination here. Very comfortable from the information front-desk, nurses, doctors — all cheerful and enthusiastic. 5 stars. Thank you very much.", zh: "在这里为家人登记接种疫苗。从前台到护士、医生都热情亲切,体验非常舒适。五星好评,非常感谢。", ms: "Daftar keluarga saya untuk vaksinasi di sini. Sangat selesa dari kaunter maklumat, jururawat, doktor — semuanya ceria dan bersemangat. 5 bintang. Terima kasih banyak." } },
                    { author: "Panda Pam", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 5, text: { en: "Great ambiance and easily accessible location. Everything was smooth from registration to consultation and medication collection. The lady staff was very friendly, the doctor was great as well.", zh: "环境很好,位置方便。从挂号、就诊到取药全程顺畅。女工作人员非常友好,医生也很棒。", ms: "Suasana hebat dan lokasi mudah diakses. Semuanya lancar dari pendaftaran ke konsultasi dan kutipan ubat. Kakitangan wanita sangat mesra, doktor pun bagus." } }
                ]
            },
            {
                id: "tampines-family-medicine",
                name: "Tampines Family Medicine Clinic",
                icon: "🩺",
                image: "images/tampinesfamily.jpg",
                unit: "#03-34",
                category: { en: "Medical clinic", zh: "医疗诊所", ms: "Klinik perubatan" },
                rating: 3.6,
                reviewsCount: 66,
                address: "1 Tampines Walk, Our Tampines Hub, #03-34, Singapore 528523",
                phone: "6702 6022",
                hours: { en: "Closed today · Opens 9 am Thu", zh: "今日休息 · 周四上午9点开门", ms: "Ditutup hari ini · Buka 9 pagi Khamis" },
                tagline: { en: "Family GP clinic. Mixed reviews — some praise Dr Ng & Dr Aziz, others mention long waits.", zh: "家庭全科诊所。评价褒贬不一 — 有人称赞黄医生和Aziz医生,也有人提到等候时间长。", ms: "Klinik GP keluarga. Ulasan bercampur — sesetengah memuji Dr Ng & Dr Aziz, lain pula sebut menunggu lama." },
                reviews: [
                    { author: "Tam Felicia", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 5, text: { en: "Grateful for Dr Ng — taking extra effort to help my elderly mom by suggesting solutions for taking her medication in a timely routine. Also shared ways to care for ageing parents with more compassion. Really eases a lot of our load. Thank you!", zh: "非常感谢黄医生 — 用心帮助我年迈的母亲,建议按时服药的方法,也分享了如何更体贴地照顾年老父母。真的减轻了我们很多负担。谢谢!", ms: "Bersyukur dengan Dr Ng — beliau berusaha lebih untuk bantu ibu saya yang sudah berumur dengan cadangan rutin pengambilan ubat. Juga berkongsi cara menjaga ibu bapa tua dengan lebih belas kasihan. Sangat meringankan beban kami. Terima kasih!" } },
                    { author: "Wilfred Tan", time: { en: "6 months ago", zh: "6个月前", ms: "6 bulan lalu" }, rating: 5, text: { en: "Not really the kind of person to write a review, but Dr. Aziz was very helpful and shared a lot of information. He was very nice as well. Please let him know he's doing a great job!", zh: "我平时不太写评论,但Aziz医生真的非常乐于助人,分享了很多信息。人也很好。请转告他做得很棒!", ms: "Saya bukan jenis orang yang suka tulis ulasan, tetapi Dr. Aziz sangat membantu dan berkongsi banyak maklumat. Beliau juga sangat baik. Tolong sampaikan beliau melakukan kerja yang hebat!" } },
                    { author: "Wendy Kek", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 1, text: { en: "Very poor experience. I was told only two patients were ahead of me, but after waiting half an hour, staff suddenly said there were four more registered patients before me and suggested I come back another day. Completely misleading, wasted my time and handled unprofessionally. I walked out and will not return.", zh: "体验很差。被告知前面只有两位病人,但等了半小时后,工作人员突然说前面还有四位已登记的病人,建议我改天再来。完全是误导,浪费我的时间,处理也不专业。我直接离开,不会再来。", ms: "Pengalaman yang sangat buruk. Saya diberitahu hanya ada dua pesakit di depan, tetapi selepas tunggu setengah jam, kakitangan tiba-tiba kata ada empat lagi pesakit berdaftar di depan saya dan cadang saya datang hari lain. Mengelirukan, membazir masa saya dan ditangani secara tidak profesional. Saya keluar dan tidak akan kembali." } }
                ]
            },
            {
                id: "qm-dental",
                name: "Q&M Dental Surgery, Tampines Hub",
                icon: "🦷",
                image: "images/qnm.jpg",
                unit: "#02-89",
                category: { en: "Dental clinic", zh: "牙科诊所", ms: "Klinik pergigian" },
                rating: 4.4,
                reviewsCount: 82,
                address: "1 Tampines Walk, #02-89 Our Tampines Hub, Singapore 528523",
                phone: "6260 1822",
                hours: { en: "Mon–Fri 9am–9pm · Sat–Sun 9am–6pm", zh: "周一至周五 上午9点 – 晚上9点 · 周六周日 上午9点 – 晚上6点", ms: "Isnin–Jumaat 9 pagi–9 malam · Sabtu–Ahad 9 pagi–6 malam" },
                tagline: { en: "General & cosmetic dentistry. Walk-ins welcome.", zh: "普通和美容牙科。欢迎现场挂号。", ms: "Pergigian umum & kosmetik. Walk-in dialu-alukan." },
                reviews: [
                    { author: "Lily Ong", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 5, text: { en: "Dr Tan was patient and explained every step clearly before my filling. No pain at all. Will definitely come back for my cleaning.", zh: "陈医生很耐心,补牙前每一步都解释得很清楚。一点也不痛。下次洁牙一定还来。", ms: "Dr Tan sangat sabar dan jelaskan setiap langkah sebelum tampalan gigi saya. Langsung tidak sakit. Pasti akan kembali untuk pembersihan." } },
                    { author: "Marcus Lim", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 4, text: { en: "Wait was about 20 mins past my appointment time but the dentist was thorough. Reasonable price for the polishing.", zh: "比预约时间晚了约20分钟,但牙医诊治很仔细。洁牙价格合理。", ms: "Tunggu sekitar 20 minit selepas masa janji temu tetapi doktor gigi sangat teliti. Harga berpatutan untuk pengilatan." } },
                    { author: "Aisha R.", time: { en: "5 months ago", zh: "5个月前", ms: "5 bulan lalu" }, rating: 4, text: { en: "Brought my 7-year-old for his first dental visit. Staff were friendly and helped him feel at ease.", zh: "带7岁的儿子来第一次看牙。工作人员很友好,让他放松下来。", ms: "Bawa anak saya berumur 7 tahun untuk lawatan pergigian pertamanya. Kakitangan mesra dan bantu dia rasa selesa." } }
                ]
            },
            {
                id: "pharmex",
                name: "Pharmex Healthcare",
                icon: "💊",
                image: "images/pharmex.jpg",
                unit: "#B1-02/03",
                category: { en: "Pharmacy", zh: "药房", ms: "Farmasi" },
                rating: 4.2,
                reviewsCount: 54,
                address: "1 Tampines Walk, #B1-02/03 Our Tampines Hub, Singapore 528523",
                phone: "6260 5566",
                hours: { en: "Daily 10am–10pm", zh: "每日 上午10点 – 晚上10点", ms: "Setiap hari 10 pagi–10 malam" },
                tagline: { en: "Pharmacy in basement near FairPrice. Has consult counter.", zh: "位于地下层FairPrice附近的药房,设有咨询柜台。", ms: "Farmasi di tingkat bawah dekat FairPrice. Ada kaunter konsultasi." },
                reviews: [
                    { author: "Mrs Goh", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Pharmacist took time to explain my mother's diabetes medication. Very patient with elderly customers.", zh: "药剂师花时间详细讲解我母亲的糖尿病药物。对老年顾客非常有耐心。", ms: "Ahli farmasi luangkan masa untuk jelaskan ubat diabetes ibu saya. Sangat sabar dengan pelanggan warga emas." } },
                    { author: "Jason K.", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Decent range of products, prices similar to Guardian. Convenient if you're already at the basement.", zh: "产品种类不错,价格和Guardian相当。如果你刚好在地下层就很方便。", ms: "Pilihan produk yang baik, harga setanding Guardian. Sesuai jika anda sudah berada di tingkat bawah." } },
                    { author: "Priya M.", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 4, text: { en: "Got my flu vaccination here, quick and painless. Walk-in was accepted on a weekday morning.", zh: "在这里接种了流感疫苗,又快又不痛。工作日早上可以直接走进去。", ms: "Saya ambil vaksin selesema di sini, cepat dan tidak sakit. Walk-in diterima pada pagi hari bekerja." } }
                ]
            },
            {
                id: "guardian",
                name: "Guardian Pharmacy",
                icon: "💊",
                image: "images/guardian.jpg",
                unit: "#B1-29/30",
                category: { en: "Pharmacy", zh: "药房", ms: "Farmasi" },
                rating: 4.0,
                reviewsCount: 31,
                address: "1 Tampines Walk, #B1-29/30 Our Tampines Hub, Singapore 528523",
                phone: "6789 1234",
                hours: { en: "Daily 10am–10pm", zh: "每日 上午10点 – 晚上10点", ms: "Setiap hari 10 pagi–10 malam" },
                tagline: { en: "Chain pharmacy. Member discounts and beauty range.", zh: "连锁药房。会员折扣,有美容产品系列。", ms: "Farmasi rangkaian. Diskaun ahli dan rangkaian kecantikan." },
                reviews: [
                    { author: "Hui Min", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Staff are helpful when looking for specific products. Member promotions are quite worth it.", zh: "找特定产品时工作人员很乐于帮助。会员促销很划算。", ms: "Kakitangan membantu apabila mencari produk tertentu. Promosi ahli memang berbaloi." } },
                    { author: "Daniel C.", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 4, text: { en: "Standard Guardian outlet. Came in for paracetamol and lozenges — well stocked.", zh: "标准的Guardian门店。来买扑热息痛和喉糖 — 货品齐全。", ms: "Cawangan Guardian standard. Datang untuk paracetamol dan ubat batuk — stok lengkap." } },
                    { author: "Faridah", time: { en: "5 months ago", zh: "5个月前", ms: "5 bulan lalu" }, rating: 4, text: { en: "Good selection of skincare on top of medicine. Convenient location.", zh: "除了药品,护肤品选择也不错。位置方便。", ms: "Pilihan penjagaan kulit yang baik selain ubat-ubatan. Lokasi yang strategik." } }
                ]
            },
            {
                id: "pearls-visioncare",
                name: "Pearl's Visioncare",
                icon: "👓",
                image: "images/pearlvisioncare.jpg",
                unit: "#01-87",
                category: { en: "Optical / Eye care", zh: "眼镜 / 视力护理", ms: "Optikal / Penjagaan mata" },
                rating: 4.6,
                reviewsCount: 47,
                address: "1 Tampines Walk, #01-87 Our Tampines Hub, Singapore 528523",
                phone: "6786 9988",
                hours: { en: "Mon–Sun 11am–9pm", zh: "周一至周日 上午11点 – 晚上9点", ms: "Isnin–Ahad 11 pagi–9 malam" },
                tagline: { en: "Eye check, prescription glasses, contact lenses.", zh: "视力检查、配镜、隐形眼镜。", ms: "Pemeriksaan mata, cermin mata berpreskripsi, kanta sentuh." },
                reviews: [
                    { author: "Wei Ling", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 5, text: { en: "Optometrist did a careful eye check and didn't pressure me into expensive frames. Very honest.", zh: "验光师认真做了视力检查,没有推销贵重镜框。非常诚实。", ms: "Pakar optometri buat pemeriksaan mata yang teliti dan tidak desak saya beli bingkai mahal. Sangat jujur." } },
                    { author: "Samuel T.", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 5, text: { en: "Got my son's first pair of glasses here. Wide selection of kids' frames and the staff were great with him.", zh: "在这里给儿子配了第一副眼镜。儿童镜框种类多,工作人员对他很好。", ms: "Beli cermin mata pertama anak saya di sini. Pilihan bingkai kanak-kanak yang luas dan kakitangan layan dia dengan baik." } },
                    { author: "Bee Choo", time: { en: "6 months ago", zh: "6个月前", ms: "6 bulan lalu" }, rating: 4, text: { en: "Reasonable prices, frames ready in 3 days. Polite service.", zh: "价格合理,镜框3天就做好了。服务也礼貌。", ms: "Harga berpatutan, bingkai siap dalam 3 hari. Khidmat yang sopan." } }
                ]
            },
            {
                id: "chiropractic-sg",
                name: "Chiropractic Singapore",
                icon: "💆",
                image: "images/chiropractic.jpg",
                unit: "#B1-21",
                category: { en: "Chiropractor", zh: "脊椎按摩", ms: "Kiropraktor" },
                rating: 4.3,
                reviewsCount: 22,
                address: "1 Tampines Walk, #B1-21 Our Tampines Hub, Singapore 528523",
                phone: "6385 5547",
                hours: { en: "Mon–Sat 10am–8pm", zh: "周一至周六 上午10点 – 晚上8点", ms: "Isnin–Sabtu 10 pagi–8 malam" },
                tagline: { en: "Back & neck adjustments. Book ahead for shorter wait.", zh: "背部与颈部调整。提前预约可减少等候时间。", ms: "Pelarasan belakang & leher. Tempah awal untuk kurangkan masa menunggu." },
                reviews: [
                    { author: "Kenneth W.", time: { en: "3 weeks ago", zh: "3周前", ms: "3 minggu lalu" }, rating: 5, text: { en: "Helped my lower-back pain after sitting too long at work. Felt better after 3 sessions.", zh: "工作久坐导致的腰痛在这里得到了缓解。3次治疗后明显好转。", ms: "Membantu sakit pinggang saya selepas terlalu lama duduk di tempat kerja. Rasa lebih baik selepas 3 sesi." } },
                    { author: "Joyce L.", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Friendly chiropractor, explained the cause of my neck stiffness. Sessions are short but effective.", zh: "脊椎按摩师很友好,解释了我颈部僵硬的原因。疗程虽短但有效。", ms: "Kiropraktor yang mesra, jelaskan punca leher saya kaku. Sesi singkat tetapi berkesan." } },
                    { author: "Henry T.", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 4, text: { en: "Reasonable pricing for the area. Booking via WhatsApp is easy.", zh: "在这一带价格合理。用WhatsApp预约很方便。", ms: "Harga berpatutan untuk kawasan ini. Tempahan melalui WhatsApp mudah." } }
                ]
            }
        ]
    },

    food: {
        title: { en: "Food & Hawker", zh: "美食与小贩", ms: "Makanan & Penjaja" },
        subtitle: { en: "Top food picks at Our Tampines Hub", zh: "淡滨尼天地的人气美食推荐", ms: "Pilihan makanan teratas di Our Tampines Hub" },
        icon: "🍜",
        places: [
            {
                id: "wingstop",
                name: "Wingstop",
                icon: "🍗",
                image: "images/wingstop.jpg",
                unit: "#B1-K5",
                category: { en: "Chicken wings", zh: "炸鸡翅", ms: "Kepak ayam" },
                rating: 4.4,
                reviewsCount: 312,
                address: "1 Tampines Walk, #B1-K5 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 11am–10pm", zh: "每日 上午11点 – 晚上10点", ms: "Setiap hari 11 pagi–10 malam" },
                tagline: { en: "Famous for bold-flavour chicken wings — Louisiana Rub & Mango Habanero.", zh: "以重口味鸡翅闻名 — 路易斯安那香料与芒果哈瓦那。", ms: "Terkenal dengan kepak ayam berperisa berani — Louisiana Rub & Mango Habanero." },
                reviews: [
                    { author: "Jeremy S.", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Garlic Parmesan flavour is the best. Crispy and not too oily. Fries are a must!", zh: "蒜香帕玛森口味最棒。酥脆不油腻。薯条必点!", ms: "Perisa Garlic Parmesan paling sedap. Rangup dan tidak terlalu berminyak. Kentang goreng wajib!" } },
                    { author: "Nadia", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Wings are good but pricey. Worth it as a treat. Atomic is too spicy for me, stick with Mango Habanero.", zh: "鸡翅好吃但价格偏高。偶尔犒劳自己值得。Atomic太辣,我选芒果哈瓦那。", ms: "Kepak ayam sedap tetapi mahal. Berbaloi untuk hadiah diri. Atomic terlalu pedas, saya pilih Mango Habanero." } },
                    { author: "Wei Jie", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 5, text: { en: "Boneless Wingstop combo + ranch dip = lunch sorted. Service was quick on a weekday.", zh: "无骨套餐配田园酱 = 完美午餐。工作日上菜很快。", ms: "Combo Wingstop tanpa tulang + ranch dip = makan tengah hari selesai. Khidmat cepat pada hari bekerja." } }
                ]
            },
            {
                id: "subway",
                name: "Subway",
                icon: "🥪",
                image: "images/subway.jpg",
                unit: "#B1-52A",
                category: { en: "Sandwiches", zh: "三明治", ms: "Sandwic" },
                rating: 4.1,
                reviewsCount: 198,
                address: "1 Tampines Walk, #B1-52A Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 8am–10pm", zh: "每日 上午8点 – 晚上10点", ms: "Setiap hari 8 pagi–10 malam" },
                tagline: { en: "Build-your-own subs and salads. Healthy-ish quick lunch.", zh: "自选三明治和沙拉。比较健康的快餐午餐。", ms: "Buat-sendiri sub dan salad. Pilihan makan tengah hari yang agak sihat." },
                reviews: [
                    { author: "Bryan", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Standard Subway, friendly sandwich artists. Chicken teriyaki on honey oat — never wrong.", zh: "标准的Subway,工作人员友好。蜂蜜燕麦面包配照烧鸡 — 永远不会错。", ms: "Subway biasa, pekerja sandwic yang mesra. Chicken teriyaki atas honey oat — tidak pernah salah." } },
                    { author: "Cheryl", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Good for a quick meal. Queue moves fast even at lunch hour.", zh: "适合快速用餐。即使午餐时间排队也快。", ms: "Sesuai untuk makan cepat. Barisan bergerak laju walaupun waktu makan tengah hari." } },
                    { author: "Marcus", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 4, text: { en: "Like that they have the salad bowls too. Affordable lunch under $10.", zh: "喜欢他们也有沙拉碗。10新元以下的实惠午餐。", ms: "Suka mereka ada salad bowl juga. Makan tengah hari berpatutan kurang $10." } }
                ]
            },
            {
                id: "old-chang-kee",
                name: "Old Chang Kee Coffee House",
                icon: "🥟",
                image: "images/oldchangkee.jpg",
                unit: "#01-105",
                category: { en: "Curry puffs & local snacks", zh: "咖喱角与本地小吃", ms: "Karipap & snek tempatan" },
                rating: 4.5,
                reviewsCount: 421,
                address: "1 Tampines Walk, #01-105 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 8am–10pm", zh: "每日 上午8点 – 晚上10点", ms: "Setiap hari 8 pagi–10 malam" },
                tagline: { en: "Iconic curry puffs plus a wider coffee-house menu of nasi lemak & noodles.", zh: "招牌咖喱角,以及椰浆饭、面食等咖啡馆菜单。", ms: "Karipap ikonik serta menu kedai kopi yang lebih luas — nasi lemak & mi." },
                reviews: [
                    { author: "Auntie Lim", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Curry puff still the best in Tampines. Got the curry chicken set, the bowl is generous.", zh: "咖喱角依然是淡滨尼最好吃的。点了咖喱鸡套餐,分量很足。", ms: "Karipap masih yang terbaik di Tampines. Saya beli set kari ayam, mangkuk besar." } },
                    { author: "Stanley", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 5, text: { en: "Love that this branch has the dine-in coffee house. Ngoh hiang and otah on rice was very satisfying.", zh: "喜欢这家分店有堂食咖啡馆。五香配乌达加饭非常满足。", ms: "Suka cawangan ini ada kedai kopi makan dalam. Ngoh hiang dan otah atas nasi sangat memuaskan." } },
                    { author: "Joanne", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "A bit pricier than the kiosk versions but the menu has more variety. Curry puffs always reliable.", zh: "比小档版本贵一些,但菜单选择更多。咖喱角总是稳定好吃。", ms: "Sedikit mahal berbanding kiosk tetapi menu lebih pelbagai. Karipap sentiasa boleh dipercayai." } }
                ]
            },
            {
                id: "nene-chicken",
                name: "NENE Chicken",
                icon: "🐔",
                image: "images/nenechicken.jpg",
                unit: "#01-81",
                category: { en: "Korean fried chicken", zh: "韩式炸鸡", ms: "Ayam goreng Korea" },
                rating: 4.3,
                reviewsCount: 287,
                address: "1 Tampines Walk, #01-81 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 11am–10pm", zh: "每日 上午11点 – 晚上10点", ms: "Setiap hari 11 pagi–10 malam" },
                tagline: { en: "Korean fried chicken — Freaking Hot & Snowing flavours are favourites.", zh: "韩式炸鸡 — Freaking Hot 与 Snowing 口味最受欢迎。", ms: "Ayam goreng Korea — perisa Freaking Hot & Snowing adalah kegemaran." },
                reviews: [
                    { author: "Aishah", time: { en: "3 weeks ago", zh: "3周前", ms: "3 minggu lalu" }, rating: 5, text: { en: "Snowing cheese is so good. Crispy and the chicken stays juicy inside.", zh: "Snowing芝士口味太好吃了。外皮酥脆,里面的鸡肉依然多汁。", ms: "Snowing cheese sangat sedap. Rangup dan ayam tetap juicy di dalam." } },
                    { author: "Daniel", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Sharing combo with friends was great value. Freaking Hot really is freaking hot.", zh: "和朋友一起点分享餐很划算。Freaking Hot真的非常辣。", ms: "Set perkongsian dengan kawan sangat berbaloi. Freaking Hot memang sangat pedas." } },
                    { author: "Mei Ling", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Good Korean fried chicken option in the east. A bit oily but that's the point I guess.", zh: "东部不错的韩式炸鸡选择。有点油,但大概这就是它的特色。", ms: "Pilihan ayam goreng Korea yang baik di kawasan timur. Sedikit berminyak tetapi itu memang ciri khasnya." } }
                ]
            },
            {
                id: "starbucks",
                name: "Starbucks Coffee",
                icon: "☕",
                image: "images/starbucks.jpg",
                unit: "#01-104",
                category: { en: "Coffee chain", zh: "连锁咖啡店", ms: "Rangkaian kafe kopi" },
                rating: 4.4,
                reviewsCount: 376,
                address: "1 Tampines Walk, #01-104 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 7am–10pm", zh: "每日 上午7点 – 晚上10点", ms: "Setiap hari 7 pagi–10 malam" },
                tagline: { en: "Comfy seats, plenty of plugs — popular study/work spot.", zh: "座位舒适,插座多 — 受欢迎的学习/办公地点。", ms: "Tempat duduk selesa, banyak palam — tempat popular untuk belajar/kerja." },
                reviews: [
                    { author: "Rachel", time: { en: "1 week ago", zh: "1周前", ms: "1 minggu lalu" }, rating: 5, text: { en: "Spacious and well lit. Easy to find a seat compared to other branches. Wifi is decent.", zh: "空间宽敞,采光好。比其他分店更容易找到座位。Wifi也还不错。", ms: "Lapang dan terang. Senang cari tempat duduk berbanding cawangan lain. Wifi pun OK." } },
                    { author: "Hong Wei", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Standard Starbucks. Service is friendly. Brown sugar oat shaken espresso never disappoints.", zh: "标准的星巴克。服务热情。黑糖燕麦冰摇浓缩咖啡从不让人失望。", ms: "Starbucks biasa. Khidmat mesra. Brown sugar oat shaken espresso tidak pernah mengecewakan." } },
                    { author: "Sandy", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Good for casual meetings. Can get full on weekends though.", zh: "适合非正式会议。不过周末可能很满。", ms: "Sesuai untuk mesyuarat santai. Boleh jadi penuh pada hujung minggu." } }
                ]
            },
            {
                id: "yoshinoya",
                name: "Yoshinoya",
                icon: "🍱",
                image: "images/yoshinoya.jpg",
                unit: "#B1-K1/K2/K22",
                category: { en: "Japanese rice bowls", zh: "日式丼饭", ms: "Mangkuk nasi Jepun" },
                rating: 4.2,
                reviewsCount: 254,
                address: "1 Tampines Walk, #B1-K1/K2/K22 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 10am–10pm", zh: "每日 上午10点 – 晚上10点", ms: "Setiap hari 10 pagi–10 malam" },
                tagline: { en: "Beef bowls, chicken teriyaki sets — affordable Japanese fast food.", zh: "牛肉饭、照烧鸡套餐 — 实惠的日式快餐。", ms: "Nasi daging, set chicken teriyaki — makanan segera Jepun yang berpatutan." },
                reviews: [
                    { author: "Edmund", time: { en: "3 weeks ago", zh: "3周前", ms: "3 minggu lalu" }, rating: 4, text: { en: "Beef bowl is filling for the price. Self-serve order kiosks make it quick.", zh: "牛肉饭分量足,价格合理。自助点餐机加快了流程。", ms: "Mangkuk daging mengenyangkan untuk harganya. Kiosk pesanan layan diri buatkan ia cepat." } },
                    { author: "Hannah", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Reliable lunch option. Chicken teriyaki set is my go-to.", zh: "可靠的午餐选择。照烧鸡套餐是我的最爱。", ms: "Pilihan makan tengah hari yang boleh diharap. Set chicken teriyaki kegemaran saya." } },
                    { author: "Vincent", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Good portion of rice, sauce is well-balanced. Nothing fancy but consistent.", zh: "饭量足,酱料调配得宜。没什么花哨,但水准稳定。", ms: "Bahagian nasi banyak, sosnya seimbang. Tidak ada apa yang istimewa tetapi konsisten." } }
                ]
            },
            {
                id: "mos-burger",
                name: "MOS Burger",
                icon: "🍔",
                image: "images/mosburger.jpg",
                unit: "#01-85",
                category: { en: "Japanese-style burgers", zh: "日式汉堡", ms: "Burger gaya Jepun" },
                rating: 4.3,
                reviewsCount: 189,
                address: "1 Tampines Walk, #01-85 Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Daily 10am–10pm", zh: "每日 上午10点 – 晚上10点", ms: "Setiap hari 10 pagi–10 malam" },
                tagline: { en: "Burgers made-to-order — try the rice burgers.", zh: "现点现做的汉堡 — 推荐米汉堡。", ms: "Burger dibuat ikut pesanan — cuba rice burger." },
                reviews: [
                    { author: "Charmaine", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Rice burger is a comfort favourite. Took a while because it's made fresh but worth it.", zh: "米汉堡是我的心头好。现做需要等一会儿但很值得。", ms: "Rice burger kegemaran selesa. Mengambil masa kerana dibuat segar tetapi berbaloi." } },
                    { author: "Joel", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Higher quality than typical fast food. Spicy MOS burger has a kick.", zh: "品质比一般快餐高。辣味MOS汉堡很够劲。", ms: "Kualiti lebih tinggi daripada makanan segera biasa. Spicy MOS burger ada rasa pedas yang kuat." } },
                    { author: "Linda", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 4, text: { en: "Love that they don't pre-make the food. Tea is also surprisingly nice.", zh: "喜欢他们不会提前做好食物。茶也意外地好喝。", ms: "Suka mereka tidak buat makanan terlebih dahulu. Teh pun mengejutkan sedap." } }
                ]
            }
        ]
    },

    library: {
        title: { en: "Tampines Regional Library", zh: "淡滨尼区域图书馆", ms: "Perpustakaan Wilayah Tampines" },
        subtitle: { en: "Library at Our Tampines Hub", zh: "淡滨尼天地的图书馆", ms: "Perpustakaan di Our Tampines Hub" },
        icon: "📚",
        places: [
            {
                id: "tampines-regional-library",
                name: "Tampines Regional Library",
                icon: "📚",
                image: "images/library.jpg",
                unit: "Level 2 – 5",
                category: { en: "Public library", zh: "公共图书馆", ms: "Perpustakaan awam" },
                rating: 4.7,
                reviewsCount: 1248,
                address: "1 Tampines Walk, Our Tampines Hub, Levels 2–5, Singapore 528523",
                phone: "6332 3255",
                hours: { en: "Mon–Sun 10am–9pm", zh: "周一至周日 上午10点 – 晚上9点", ms: "Isnin–Ahad 10 pagi–9 malam" },
                tagline: { en: "Singapore's largest public library — kids zone, study areas, maker space.", zh: "新加坡最大的公共图书馆 — 儿童区、自习区、创客空间。", ms: "Perpustakaan awam terbesar Singapura — zon kanak-kanak, kawasan belajar, ruang pencipta." },
                reviews: [
                    { author: "Joanna T.", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Children's section is amazing — my kids spent the whole afternoon. Lots of natural light and quiet study corners on the upper floors.", zh: "儿童区太棒了 — 孩子们玩了整个下午。楼上自然光充足,自习角落也很安静。", ms: "Bahagian kanak-kanak hebat — anak saya habiskan satu petang. Banyak cahaya semula jadi dan sudut belajar yang senyap di tingkat atas." } },
                    { author: "Mr Ho", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 5, text: { en: "Largest library in Singapore — comfortable seating, plenty of plugs, and the maker space is a great touch for students. ", zh: "新加坡最大的图书馆 — 座位舒适、插座多,创客空间对学生来说是很棒的设施。", ms: "Perpustakaan terbesar di Singapura — tempat duduk selesa, banyak palam dan ruang pencipta sentuhan yang hebat untuk pelajar." } },
                    { author: "Aishwarya", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 4, text: { en: "Great range of books and quiet zones. Wish there were more discussion rooms available on weekends.", zh: "书籍种类齐全,有安静区域。希望周末有更多讨论室。", ms: "Pilihan buku yang baik dan zon senyap. Harap ada lebih banyak bilik perbincangan pada hujung minggu." } }
                ]
            }
        ]
    },

    swimming: {
        title: { en: "Tampines Swimming Complex", zh: "淡滨尼游泳中心", ms: "Kompleks Renang Tampines" },
        subtitle: { en: "Swimming pools at Our Tampines Hub", zh: "淡滨尼天地的游泳池", ms: "Kolam renang di Our Tampines Hub" },
        icon: "🏊",
        places: [
            {
                id: "tampines-swimming",
                name: "Tampines Swimming Complex",
                icon: "🏊",
                image: "images/swimmingpool.jpg",
                unit: "Level 1 – 2",
                category: { en: "Public swimming complex", zh: "公共游泳中心", ms: "Kompleks renang awam" },
                rating: 4.4,
                reviewsCount: 612,
                address: "1 Tampines Walk, Our Tampines Hub, Singapore 528523",
                phone: "6260 2828",
                hours: { en: "Mon–Sun 6.30am–9.30pm", zh: "周一至周日 上午6:30 – 晚上9:30", ms: "Isnin–Ahad 6.30 pagi–9.30 malam" },
                tagline: { en: "Competition pool, training pool, wading pool & jacuzzi.", zh: "比赛池、训练池、浅水池及按摩池。", ms: "Kolam pertandingan, kolam latihan, kolam cetek & jakuzi." },
                reviews: [
                    { author: "Marcus L.", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Lanes are spacious and water is clean. Great for early morning laps before work.", zh: "泳道宽敞,水质干净。上班前晨泳很合适。", ms: "Lorong lapang dan air bersih. Sesuai untuk pusingan awal pagi sebelum kerja." } },
                    { author: "Joycelyn", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Kids' wading pool is well designed. Showers are clean. Locker $1 coin.", zh: "儿童浅水池设计得很好。淋浴间干净。储物柜需要1新元硬币。", ms: "Kolam cetek kanak-kanak direka dengan baik. Bilik mandi bersih. Loker syiling $1." } },
                    { author: "Roy", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 4, text: { en: "Good value at $1.50 (adult). Gets crowded on weekends after 10am, go early.", zh: "1.50新元(成人)很值。周末上午10点后较拥挤,建议早点去。", ms: "Berbaloi dengan $1.50 (dewasa). Sesak pada hujung minggu selepas 10 pagi, datang awal." } }
                ]
            }
        ]
    },

    gym: {
        title: { en: "Fitness & Sports", zh: "健身与运动", ms: "Kecergasan & Sukan" },
        subtitle: { en: "Gyms and active studios at Our Tampines Hub", zh: "淡滨尼天地的健身房与运动工作室", ms: "Gim dan studio aktif di Our Tampines Hub" },
        icon: "💪",
        places: [
            {
                id: "activesg-gym",
                name: "ActiveSG Gym @ Tampines Hub",
                icon: "🏋️",
                image: "images/activesg.jpg",
                unit: "Level 1",
                category: { en: "Public gym", zh: "公共健身房", ms: "Gim awam" },
                rating: 4.5,
                reviewsCount: 423,
                address: "1 Tampines Walk, Our Tampines Hub, Singapore 528523",
                phone: "6260 2828",
                hours: { en: "Daily 7am–10pm", zh: "每日 上午7点 – 晚上10点", ms: "Setiap hari 7 pagi–10 malam" },
                tagline: { en: "Affordable public gym — cardio, weights, functional zone.", zh: "实惠的公共健身房 — 有氧、力量与功能训练区。", ms: "Gim awam berpatutan — kardio, beban, zon berfungsi." },
                reviews: [
                    { author: "Jared", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Well-equipped gym at very reasonable rates with ActiveSG credits. Free weights section is decent.", zh: "设备齐全的健身房,使用ActiveSG积分价格非常合理。自由力量区也不错。", ms: "Gim yang lengkap pada kadar berpatutan dengan kredit ActiveSG. Bahagian free weights memuaskan." } },
                    { author: "Si Hui", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Gets busy after work hours. Equipment is well maintained though.", zh: "下班后人多。不过设备保养得很好。", ms: "Sibuk selepas waktu kerja. Walau bagaimanapun peralatan diselenggara dengan baik." } },
                    { author: "Aaron", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 5, text: { en: "Good cardio machines and the squat racks are usually free in the morning.", zh: "有氧器材好,深蹲架早上通常都空着。", ms: "Mesin kardio yang baik dan squat rack biasanya kosong pada waktu pagi." } }
                ]
            },
            {
                id: "yoga-inc",
                name: "Yoga Inc",
                icon: "🧘",
                image: "images/yogainc.jpg",
                unit: "#B1-06/07",
                category: { en: "Yoga studio", zh: "瑜伽工作室", ms: "Studio yoga" },
                rating: 4.6,
                reviewsCount: 158,
                address: "1 Tampines Walk, #B1-06/07 Our Tampines Hub, Singapore 528523",
                phone: "6789 4567",
                hours: { en: "Mon–Sat 8am–9pm", zh: "周一至周六 上午8点 – 晚上9点", ms: "Isnin–Sabtu 8 pagi–9 malam" },
                tagline: { en: "Hatha, vinyasa, and aerial yoga. Trial class available.", zh: "提供哈他、流瑜伽、空中瑜伽。有试堂体验。", ms: "Hatha, vinyasa dan yoga udara. Kelas percubaan tersedia." },
                reviews: [
                    { author: "Felicia", time: { en: "3 weeks ago", zh: "3周前", ms: "3 minggu lalu" }, rating: 5, text: { en: "Instructors are very attentive and adjust your posture personally. Studio is calming and well-ventilated.", zh: "教练非常细心,会亲自调整体式。工作室让人放松,通风也好。", ms: "Pengajar sangat teliti dan laraskan postur secara peribadi. Studio menenangkan dan berventilasi baik." } },
                    { author: "Megan", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 5, text: { en: "Loved the aerial yoga class — beginner-friendly and fun. Will be back.", zh: "很喜欢空中瑜伽课 — 适合初学者又有趣。一定会再来。", ms: "Suka kelas yoga udara — mesra pemula dan menyeronokkan. Akan datang lagi." } },
                    { author: "Ravi", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 4, text: { en: "Bought a 10-class pass, good value. Booking app is easy to use.", zh: "买了10次课的套票,很划算。预约的App也好用。", ms: "Beli pas 10 kelas, berbaloi. App tempahan mudah digunakan." } }
                ]
            },
            {
                id: "jh-kim-taekwondo",
                name: "JH Kim Taekwondo",
                icon: "🥋",
                image: "images/jhkimtaekwando.png",
                unit: "#B1-14",
                category: { en: "Martial arts academy", zh: "武术学院", ms: "Akademi seni mempertahankan diri" },
                rating: 4.7,
                reviewsCount: 96,
                address: "1 Tampines Walk, #B1-14 Our Tampines Hub, Singapore 528523",
                phone: "6386 7755",
                hours: { en: "Tue–Sun 3pm–9pm", zh: "周二至周日 下午3点 – 晚上9点", ms: "Selasa–Ahad 3 petang–9 malam" },
                tagline: { en: "Taekwondo for kids and adults. Friendly competition team.", zh: "面向儿童和成人的跆拳道课。友善的比赛队伍。", ms: "Taekwondo untuk kanak-kanak dan dewasa. Pasukan pertandingan yang mesra." },
                reviews: [
                    { author: "Mrs Chen", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 5, text: { en: "My 6-year-old has so much fun here. Coaches are patient and encouraging.", zh: "我6岁的孩子在这里玩得很开心。教练有耐心又鼓励人。", ms: "Anak saya berumur 6 tahun seronok di sini. Jurulatih sabar dan menggalakkan." } },
                    { author: "Adrian", time: { en: "2 months ago", zh: "2个月前", ms: "2 bulan lalu" }, rating: 5, text: { en: "Joined the adult class to get back in shape — challenging but inclusive. Good community.", zh: "参加了成人班想恢复体态 — 有挑战性但很包容。社群氛围好。", ms: "Sertai kelas dewasa untuk kembali bentuk badan — mencabar tetapi inklusif. Komuniti yang baik." } },
                    { author: "Joelle", time: { en: "4 months ago", zh: "4个月前", ms: "4 bulan lalu" }, rating: 4, text: { en: "Reasonable fees, structured grading system. Studio is well kept.", zh: "学费合理,升级制度有条理。工作室保养得很好。", ms: "Yuran berpatutan, sistem penggredan tersusun. Studio dijaga dengan baik." } }
                ]
            }
        ]
    },

    plaza: {
        title: { en: "Festive Plaza", zh: "节庆广场", ms: "Plaza Perayaan" },
        subtitle: { en: "Outdoor plaza at Our Tampines Hub", zh: "淡滨尼天地的户外广场", ms: "Plaza luar di Our Tampines Hub" },
        icon: "🌳",
        places: [
            {
                id: "festive-plaza",
                name: "Festive Plaza @ OTH",
                icon: "🌳",
                image: "images/festiveplaza.jpg",
                unit: "Outdoor",
                category: { en: "Community plaza", zh: "社区广场", ms: "Plaza komuniti" },
                rating: 4.5,
                reviewsCount: 274,
                address: "1 Tampines Walk, Our Tampines Hub, Singapore 528523",
                phone: "—",
                hours: { en: "Open 24/7", zh: "全天开放", ms: "Buka 24/7" },
                tagline: { en: "Outdoor plaza for community events, bazaars and pop-up markets.", zh: "举办社区活动、市集与快闪市场的户外广场。", ms: "Plaza luar untuk acara komuniti, bazar dan pasar pop-up." },
                reviews: [
                    { author: "Hannah", time: { en: "2 weeks ago", zh: "2周前", ms: "2 minggu lalu" }, rating: 5, text: { en: "Caught the Ramadan bazaar here — lovely atmosphere and lots of food stalls.", zh: "在这里赶上了斋戒月市集 — 气氛很好,小吃摊也很多。", ms: "Sempat lawat bazar Ramadan di sini — suasana indah dan banyak gerai makanan." } },
                    { author: "Mr Tan", time: { en: "1 month ago", zh: "1个月前", ms: "1 bulan lalu" }, rating: 4, text: { en: "Nice open space for community events. Can get hot in the afternoon, evenings are best.", zh: "举办社区活动的好地方。下午会热,傍晚最舒服。", ms: "Ruang terbuka yang bagus untuk acara komuniti. Boleh jadi panas pada waktu tengah hari, lebih baik petang." } },
                    { author: "Sara", time: { en: "3 months ago", zh: "3个月前", ms: "3 bulan lalu" }, rating: 5, text: { en: "Took my kids to the National Day mini-fair here — fun for the whole family.", zh: "带孩子来参加国庆小集市 — 全家都玩得很开心。", ms: "Bawa anak-anak ke mini-fair Hari Kebangsaan di sini — seronok untuk seluruh keluarga." } }
                ]
            }
        ]
    }
};

// State for the currently open directory & place
let currentDirectoryKey = null;
let currentDirectorySort = 'rating';
let currentPlaceId = null;
let pendingReviewRating = 0;

// Resolve a multilingual value object { en, zh, ms } to the current language,
// or return as-is if it's already a string.
function t(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[currentLanguage] || value.en || '';
}

// Read a translated UI string from the loaded translations.json
function uiText(key, fallback) {
    const pack = translations[currentLanguage];
    if (pack && pack[key]) return pack[key];
    return fallback != null ? fallback : key;
}

// ===== Render: directory listing =====
function openDirectory(categoryKey) {
    const dir = directoriesData[categoryKey];
    if (!dir) return;
    currentDirectoryKey = categoryKey;
    currentDirectorySort = 'rating';

    document.getElementById('directoryTitle').textContent = t(dir.title);
    document.getElementById('directorySubtitle').textContent = t(dir.subtitle);

    // Reset sort chips
    document.querySelectorAll('.directory-sort .sort-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.sort === 'rating');
    });

    renderDirectoryList();
    showPage('directory-page');
}

function setDirectorySort(sortKey) {
    currentDirectorySort = sortKey;
    document.querySelectorAll('.directory-sort .sort-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.sort === sortKey);
    });
    renderDirectoryList();
}

function renderDirectoryList() {
    const list = document.getElementById('directoryList');
    if (!list || !currentDirectoryKey) return;
    const dir = directoriesData[currentDirectoryKey];

    // Sort a copy by selected key (use combined rating that includes user reviews)
    const places = dir.places.slice().sort((a, b) => {
        const aStats = combinedRatingFor(a);
        const bStats = combinedRatingFor(b);
        if (currentDirectorySort === 'reviews') {
            return bStats.count - aStats.count;
        }
        return bStats.rating - aStats.rating;
    });

    const reviewsLabel = uiText('reviewsLabel', 'reviews');
    list.innerHTML = places.map(place => {
        const stats = combinedRatingFor(place);
        const thumb = place.image
            ? `<img class="place-card-thumb" src="${escapeHtml(place.image)}" alt="${escapeHtml(place.name)}">`
            : `<div class="place-card-icon">${place.icon}</div>`;
        return `
            <div class="place-card" onclick="openPlace('${place.id}')">
                ${thumb}
                <div class="place-card-body">
                    <h3 class="place-card-name">${escapeHtml(place.name)}</h3>
                    <div class="place-card-rating-row">
                        <span class="place-card-stars">${starString(stats.rating)}</span>
                        <span class="place-card-rating-num">${stats.rating.toFixed(1)}</span>
                        <span class="place-card-reviews-count">(${stats.count} ${escapeHtml(reviewsLabel)})</span>
                    </div>
                    <span class="place-card-unit">${escapeHtml(place.unit)}</span>
                    <p class="place-card-tagline">${escapeHtml(t(place.tagline))}</p>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Render: place detail =====
function openPlace(placeId) {
    const place = findPlaceById(placeId);
    if (!place) return;
    currentPlaceId = placeId;
    pendingReviewRating = 0;

    const stats = combinedRatingFor(place);

    document.getElementById('placeName').textContent = place.name;
    const heroImg = document.getElementById('placeHeroImage');
    const iconBig = document.getElementById('placeIconBig');
    if (place.image) {
        heroImg.src = place.image;
        heroImg.alt = place.name;
        heroImg.style.display = 'block';
        iconBig.style.display = 'none';
    } else {
        heroImg.style.display = 'none';
        iconBig.style.display = 'flex';
        iconBig.textContent = place.icon;
    }
    const reviewsLabel = uiText('reviewsLabel', 'reviews');
    document.getElementById('placeStars').textContent = starString(stats.rating);
    document.getElementById('placeRatingNum').textContent = stats.rating.toFixed(1);
    document.getElementById('placeReviewsCount').textContent = `(${stats.count} ${reviewsLabel})`;
    document.getElementById('placeCategoryLine').textContent = t(place.category);
    document.getElementById('placeAddress').textContent = place.address;
    document.getElementById('placePhone').textContent = place.phone || '—';
    document.getElementById('placeHours').textContent = t(place.hours);

    // Hide review form and reset
    closeReviewForm();
    renderReviewsList();

    showPage('place-page');
}

function backFromPlace() {
    if (currentDirectoryKey) {
        showPage('directory-page');
    } else {
        showPage('home-page');
    }
}

function renderReviewsList() {
    const place = findPlaceById(currentPlaceId);
    const listEl = document.getElementById('reviewsList');
    if (!place || !listEl) return;

    const userReviews = loadUserReviews(currentPlaceId);
    // User reviews on top, then sample Google reviews
    const all = userReviews.concat(place.reviews || []);

    const youBadge = uiText('youBadge', 'You');
    const justNow = uiText('justNow', 'Just now');

    listEl.innerHTML = all.map(r => {
        // User-written reviews stored their time as the literal string at submission
        // time; if it's the marker we use for "Just now", show the translated label.
        let timeLabel;
        if (r.isYou) {
            timeLabel = justNow;
        } else {
            timeLabel = t(r.time);
        }
        return `
            <div class="review-item">
                <div class="review-author-row">
                    <span class="review-author">${escapeHtml(r.author)}</span>
                    ${r.isYou ? `<span class="review-badge-yours">${escapeHtml(youBadge)}</span>` : ''}
                    <span class="review-time">${escapeHtml(timeLabel)}</span>
                </div>
                <div class="review-stars">${starString(r.rating)}</div>
                <p class="review-text">${escapeHtml(t(r.text))}</p>
            </div>
        `;
    }).join('');
}

// ===== Review form =====
function openReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;
    form.style.display = 'flex';
    pendingReviewRating = 0;
    updateStarPicker();
    document.getElementById('reviewText').value = '';
    bindStarPicker();
}

function closeReviewForm() {
    const form = document.getElementById('reviewForm');
    if (form) form.style.display = 'none';
}

function bindStarPicker() {
    const picks = document.querySelectorAll('#starInput .star-pick');
    picks.forEach(pick => {
        // Replace listener to avoid stacking
        pick.onclick = () => {
            pendingReviewRating = parseInt(pick.dataset.value, 10);
            updateStarPicker();
        };
    });
}

function updateStarPicker() {
    const picks = document.querySelectorAll('#starInput .star-pick');
    picks.forEach(pick => {
        const v = parseInt(pick.dataset.value, 10);
        if (v <= pendingReviewRating) {
            pick.textContent = '★';
            pick.classList.add('filled');
        } else {
            pick.textContent = '☆';
            pick.classList.remove('filled');
        }
    });
}

function submitReview() {
    const text = (document.getElementById('reviewText').value || '').trim();
    if (pendingReviewRating < 1) {
        alert(uiText('alertRatingRequired', 'Please pick a star rating.'));
        return;
    }
    if (!text) {
        alert(uiText('alertReviewRequired', 'Please write a short review.'));
        return;
    }
    const review = {
        author: uiText('youBadge', 'You'),
        // time is rendered live via uiText('justNow') for any review where isYou is true,
        // so this stored value is just a fallback if isYou ever gets lost.
        time: 'Just now',
        rating: pendingReviewRating,
        text: text,
        isYou: true
    };
    const userReviews = loadUserReviews(currentPlaceId);
    userReviews.unshift(review);
    saveUserReviews(currentPlaceId, userReviews);

    closeReviewForm();
    // Refresh detail + the underlying directory list (so rating ticks up)
    const place = findPlaceById(currentPlaceId);
    const stats = combinedRatingFor(place);
    const reviewsLabel = uiText('reviewsLabel', 'reviews');
    document.getElementById('placeStars').textContent = starString(stats.rating);
    document.getElementById('placeRatingNum').textContent = stats.rating.toFixed(1);
    document.getElementById('placeReviewsCount').textContent = `(${stats.count} ${reviewsLabel})`;
    renderReviewsList();
}

// ===== Storage helpers =====
function loadUserReviews(placeId) {
    try {
        const raw = localStorage.getItem('userReviews:' + placeId);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveUserReviews(placeId, reviews) {
    try {
        localStorage.setItem('userReviews:' + placeId, JSON.stringify(reviews));
    } catch (e) {
        console.error('Failed to save review', e);
    }
}

// ===== Misc helpers =====
function findPlaceById(placeId) {
    for (const key in directoriesData) {
        const found = directoriesData[key].places.find(p => p.id === placeId);
        if (found) return found;
    }
    return null;
}

function combinedRatingFor(place) {
    const userReviews = loadUserReviews(place.id);
    const userCount = userReviews.length;
    const userSum = userReviews.reduce((s, r) => s + r.rating, 0);
    const totalCount = place.reviewsCount + userCount;
    // Treat the stored reviewsCount as the weight for the baseline rating
    const blended = ((place.rating * place.reviewsCount) + userSum) / totalCount;
    return { rating: blended, count: totalCount };
}

function starString(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Bottom-nav action buttons on place page
function callPlace() {
    const place = findPlaceById(currentPlaceId);
    if (!place) return;
    if (!place.phone || place.phone === '—') {
        alert(uiText('alertPhoneUnavailable', 'Phone number not available.'));
        return;
    }
    window.location.href = 'tel:' + place.phone.replace(/\s/g, '');
}

function directionsPlace() {
    const place = findPlaceById(currentPlaceId);
    if (!place) return;
    const q = encodeURIComponent(place.name + ' ' + place.address);
    window.open('https://www.google.com/maps/search/?api=1&query=' + q, '_blank');
}
