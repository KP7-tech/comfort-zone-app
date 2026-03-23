// MOCK ALGORITHM V3 - Strict Categorization with Smooth Tolerance & Deep Real-World Data

// 1. Parent Categories and Keywords for Detection
const categoryKeywords = {
    '音樂 (Music)': ['聽', '音樂', '樂團', '五月天', '歌', 'spotify', '演唱會', '周杰倫', '伍佰', '蔡依林', '專輯', '單曲', 'music', 'pop', 'rock', 'jazz', 'band', 'song'],
    '電影 (Movies)': ['電影', '看', '戲院', 'marvel', '威秀', '國賓', '影城', 'movie', 'film', 'cinema', 'action', 'comedy', 'horror'],
    '動畫 (Animation)': ['動畫', '動漫', 'anime', 'animation', '進擊的巨人', '鬼滅', '巴哈姆特', 'bilibili', 'cartoon', '宮崎駿'],
    '連續劇 (TV Series)': ['影集', '連續劇', '台劇', '韓劇', '日劇', '美劇', 'netflix', 'disney+', 'hbomax', 'drama', 'series', '陸劇', '劇集'],
    '成人影音 (Adult Content)': ['p站', 'pornhub', 'av', '女優', 'onlyfans', 'swag', 'fc2', '無碼', 'adult', 'porn', 'nsfw', 'sex'],
    '餐飲美食 (Food)': ['麵', '飯', '吃', '餐廳', '美食', '牛排', '火鍋', '壽司', '拉麵', '夜市', 'food', 'restaurant', 'eat', 'meal', 'dinner', 'lunch'],
    '書籍 (Books)': ['書', '小說', '閱讀', '誠品', '博客來', '圖書館', '書店', 'book', 'novel', 'read', 'library'],
    '漫畫 (Manga)': ['漫畫', 'comic', 'manga', 'webtoon', '少年jump', '漫迷', '單行本'],
    '新媒體 (New Media)': ['youtube', 'twitch', 'vtuber', '直播', '頻道', '串流', 'instagram', 'tiktok', 'podcast', '油管', '博恩', '老高']
};

export function analyzeInputItems(items) {
    if (items.length < 3) {
        return { error: `需提供至少 3 個項目，目前只有 ${items.length} 個。` };
    }

    const itemCategories = items.map(item => {
        const lower = item.toLowerCase();
        let foundCategory = null;
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(kw => lower.includes(kw))) {
                foundCategory = category;
                break;
            }
        }
        return foundCategory || '未知類別 (Unknown)';
    });

    const uniqueCategories = [...new Set(itemCategories)];
    const validCategories = uniqueCategories.filter(c => c !== '未知類別 (Unknown)');
    
    if (validCategories.length > 1) {
        return { error: `偵測到多種不同類別 (${validCategories.join(', ')})。為了精準分析，請確保所有項目都屬於同一主類別，並提供至少 3 個該類別的項目。` };
    }

    const dominantCategory = validCategories.length === 1 ? validCategories[0] : null;

    if (!dominantCategory) {
        return { error: `無法辨識您輸入的事項屬於哪一個預設大類(音樂、電影、成人影音、餐飲、書籍)。請輸入更具體的事物名稱。` };
    }

    const validCount = itemCategories.filter(c => c === dominantCategory).length;
    if (validCount < 3) {
        return { error: `您輸入的項目中，只有 ${validCount} 個屬於 [${dominantCategory}]。請再補充，以確保至少有 3 個同類別項目，以利精準分析。` };
    }

    // Try to detect the specific subcategory based on items
    let detectedSubcategory = null;
    if (database[dominantCategory]) {
        for (const style of database[dominantCategory]) {
            const styleNameLower = style.name.toLowerCase();
            const styleDescLower = style.description.toLowerCase();
            
            let matched = false;
            if (items.some(input => styleNameLower.includes(input.toLowerCase()) || styleDescLower.includes(input.toLowerCase()))) {
                matched = true;
            }

            for (const dbItem of style.items) {
                const dbNameLower = dbItem.name.toLowerCase();
                if (items.some(input => dbNameLower.includes(input.toLowerCase()) || input.toLowerCase().includes(dbNameLower))) {
                    matched = true;
                    break;
                }
            }
            if (matched) {
                detectedSubcategory = style.name;
                break;
            }
        }
        
        // Fallback to the most mainstream style (score: 0) if no specific match
        if (!detectedSubcategory) {
            const mainstreamStyle = database[dominantCategory].reduce((prev, curr) => (prev.score < curr.score) ? prev : curr);
            detectedSubcategory = mainstreamStyle.name;
        }
    }

    if (!detectedSubcategory) {
        detectedSubcategory = dominantCategory;
    }

    return { category: dominantCategory, subcategory: detectedSubcategory };
}

// 2. Deep Mock Database (Parent -> Styles with Scores -> Real Items)
// Score implies "deviation" from mainstream (0 = mainstream, 100 = highly niche/extreme)
const database = {
    '音樂 (Music)': [
        {
            id: 'mus_pop', name: '流行樂 Pop Music', score: 0, description: '大眾最高接受度的流行音樂。', icon: '🎧',
            items: [
                { name: 'Taylor Swift - 1989', description: '全球最具影響力的流行音樂代表之一。', url: 'https://www.youtube.com/results?search_query=Taylor+Swift+1989' },
                { name: 'Jay Chou 周杰倫 - 范特西', description: '華語流行樂壇最具代表性的經典專輯。', url: 'https://www.youtube.com/results?search_query=周杰倫+范特西' },
                { name: 'Ed Sheeran - Divide', description: '紅遍全球的流行男聲吉他創作。', url: 'https://www.youtube.com/results?search_query=Ed+Sheeran+Divide' },
                { name: 'Blackpink - The Album', description: '席捲全球的 K-POP 流行現象。', url: 'https://www.youtube.com/results?search_query=Blackpink+The+Album' },
                { name: 'Bruno Mars - 24K Magic', description: '充滿復古又具現代感的流行舞曲。', url: 'https://www.youtube.com/results?search_query=Bruno+Mars+24K+Magic' }
            ]
        },
        {
            id: 'mus_rb', name: '節奏布魯斯 R&B', score: 10, description: '強調節奏感與靈魂唱腔。', icon: '🎙️',
            items: [
                { name: 'The Weeknd - After Hours', description: '現代 R&B 結合合成器的巔峰之作。', url: 'https://www.youtube.com/results?search_query=The+Weeknd+After+Hours' },
                { name: 'Alicia Keys - Songs in A Minor', description: '鋼琴與深情 R&B 的完美結合。', url: 'https://www.youtube.com/results?search_query=Alicia+Keys' },
                { name: '方大同 - 橙月', description: '華語 R&B 的溫暖經典。', url: 'https://www.youtube.com/results?search_query=方大同+橙月' },
                { name: 'Frank Ocean - Blonde', description: '另類 R&B 的神作，氣氛迷幻。', url: 'https://www.youtube.com/results?search_query=Frank+Ocean+Blonde' },
                { name: 'D\'Angelo - Voodoo', description: '新靈魂樂與 R&B 的絕對標竿。', url: 'https://www.youtube.com/results?search_query=Dangelo+Voodoo' }
            ]
        },
        {
            id: 'mus_rock', name: '搖滾樂 Rock Music', score: 20, description: '強烈節奏與吉他驅動的音樂。', icon: '🎸',
            items: [
                { name: 'Queen - A Night at the Opera', description: '華麗搖滾與跨界組合的傳奇。', url: 'https://www.youtube.com/results?search_query=Queen+A+Night+at+the+Opera' },
                { name: 'Coldplay - Parachutes', description: '英倫搖滾的柔情起點。', url: 'https://www.youtube.com/results?search_query=Coldplay+Parachutes' },
                { name: '五月天 - 愛情的模樣', description: '華語流行搖滾的代表天團。', url: 'https://www.youtube.com/results?search_query=五月天' },
                { name: 'AC/DC - Back in Black', description: '硬式搖滾不敗經典。', url: 'https://www.youtube.com/results?search_query=ACDC+Back+in+Black' },
                { name: 'Guns N\' Roses - Appetite for Destruction', description: '充滿爆發力的經典搖滾專輯。', url: 'https://www.youtube.com/results?search_query=Guns+N+Roses' }
            ]
        },
        {
            id: 'mus_hiphop', name: '嘻哈音樂 Hip Hop', score: 30, description: '街頭文化、說唱與強烈節拍。', icon: '🧢',
            items: [
                { name: 'Kendrick Lamar - DAMN.', description: '獲普立茲獎的深廣度嘻哈神作。', url: 'https://www.youtube.com/results?search_query=Kendrick+Lamar+DAMN' },
                { name: 'Eminem - The Marshall Mathers LP', description: '饒舌之神最具爭議與才華的展現。', url: 'https://www.youtube.com/results?search_query=Eminem' },
                { name: '蛋堡 - 收斂水', description: '華語爵士嘻哈的溫潤代表。', url: 'https://www.youtube.com/results?search_query=蛋堡+收斂水' },
                { name: 'Wu-Tang Clan - Enter the Wu-Tang', description: '東岸硬核嘻哈的武俠傳奇。', url: 'https://www.youtube.com/results?search_query=Wu-Tang+Clan' },
                { name: 'Travis Scott - ASTROWORLD', description: '現代迷幻 Trap 音樂的遊樂園。', url: 'https://www.youtube.com/results?search_query=Travis+Scott+ASTROWORLD' }
            ]
        },
        {
            id: 'mus_indie', name: '獨立音樂 Indie Music', score: 45, description: '獨立製作，風格多元不受限框架。', icon: '🏕️',
            items: [
                { name: '草東沒有派對 - 醜奴兒', description: '華語獨立樂團的破世代之聲。', url: 'https://www.youtube.com/results?search_query=草東沒有派對' },
                { name: 'Arctic Monkeys - AM', description: '英倫獨立搖滾的性感蛻變。', url: 'https://www.youtube.com/results?search_query=Arctic+Monkeys+AM' },
                { name: 'Mac DeMarco - Salad Days', description: 'Lo-Fi 與慵懶吉他流行的指標。', url: 'https://www.youtube.com/results?search_query=Mac+DeMarco+Salad+Days' },
                { name: '落日飛車 - Bossa Nova', description: '台灣出發，席捲國際的浪漫迷幻。', url: 'https://www.youtube.com/results?search_query=落日飛車' },
                { name: 'Phoebe Bridgers - Punisher', description: '心碎而幽美的獨立民謠搖滾。', url: 'https://www.youtube.com/results?search_query=Phoebe+Bridgers' }
            ]
        },
        {
            id: 'mus_jazz', name: '爵士樂 Jazz', score: 55, description: '即興、藍調音階與複雜和聲的藝術。', icon: '🎷',
            items: [
                { name: 'Miles Davis - Kind of Blue', description: '史上最偉大的爵士樂專輯，調式爵士經典。', url: 'https://www.youtube.com/results?search_query=Miles+Davis+Kind+of+Blue' },
                { name: 'John Coltrane - A Love Supreme', description: '靈性與技巧達到極致的爵士神作。', url: 'https://www.youtube.com/results?search_query=John+Coltrane+A+Love+Supreme' },
                { name: 'Ella Fitzgerald - Mack the Knife', description: '爵士女伶最無可挑惕的現場轉音即興。', url: 'https://www.youtube.com/results?search_query=Ella+Fitzgerald' },
                { name: 'Dave Brubeck - Time Out', description: '玩轉非傳統拍號的酷派爵士。', url: 'https://www.youtube.com/results?search_query=Dave+Brubeck+Time+Out' },
                { name: 'Kamasi Washington - The Epic', description: '現代壯闊而充滿野心的爵士復興。', url: 'https://www.youtube.com/results?search_query=Kamasi+Washington+The+Epic' }
            ]
        },
        {
            id: 'mus_metal', name: '金屬樂 Metal Music', score: 70, description: '極度沉重、破壞力與失真吉他的極限。', icon: '🤘',
            items: [
                { name: 'Metallica - Master of Puppets', description: '鞭擊金屬的絕對教科書。', url: 'https://www.youtube.com/results?search_query=Metallica+Master+of+Puppets' },
                { name: 'Iron Maiden - The Number of the Beast', description: '英國重金屬新浪潮的巔峰代表。', url: 'https://www.youtube.com/results?search_query=Iron+Maiden' },
                { name: 'Slipknot - Iowa', description: '充滿現代憤怒與狂躁的新金屬神作。', url: 'https://www.youtube.com/results?search_query=Slipknot+Iowa' },
                { name: '閃靈 Chthonic - 暮沉武德殿', description: '結合台灣歷史與傳統樂器的交響黑死金屬。', url: 'https://www.youtube.com/results?search_query=閃靈' },
                { name: 'Gojira - From Mars to Sirius', description: '關懷環境的前衛技術死金屬。', url: 'https://www.youtube.com/results?search_query=Gojira' }
            ]
        },
        {
            id: 'mus_nanguan', name: '南曲 Nanguan Music', score: 85, description: '中國最古老的樂種之一，節奏極度緩慢且保留古音。', icon: '🪕',
            items: [
                { name: '漢唐樂府 - 艷歌行', description: '將傳統南管結合梨園舞蹈的精緻藝術。', url: 'https://www.youtube.com/results?search_query=漢唐樂府+艷歌行' },
                { name: '心心南管樂坊 - 聲聲慢', description: '王心心老師以南管演繹李清照的千古絕唱。', url: 'https://www.youtube.com/results?search_query=心心南管樂坊' },
                { name: '指譜 - 梅花操', description: '南管傳統的四大名譜之一。', url: 'https://www.youtube.com/results?search_query=南管+梅花操' },
                { name: '江之翠劇場 - 行過洛津', description: '南管梨園戲的現代表演藝術化。', url: 'https://www.youtube.com/results?search_query=江之翠劇場' },
                { name: '傳統大譜 - 四時景', description: '描繪四季變化的南管傳統器樂曲。', url: 'https://www.youtube.com/results?search_query=南管+四時景' }
            ]
        },
        {
            id: 'mus_exp', name: '實驗音樂 Experimental Music', score: 100, description: '打破音樂所有既定規範，挑戰聽覺極限。', icon: '🎛️',
            items: [
                { name: 'Merzbow - Pulse Demon', description: '日本噪音音樂 (Japanoise) 的極端音牆代表，對非習慣者極為刺耳。', url: 'https://www.youtube.com/results?search_query=Merzbow+Pulse+Demon' },
                { name: 'John Cage - 4\'33"', description: '四分三十三秒的全休止符，重新定義音樂與環境音的界線。', url: 'https://www.youtube.com/results?search_query=John+Cage+433' },
                { name: 'Karlheinz Stockhausen - Gesang der Jünglinge', description: '早期電子與人聲結合的前衛磁帶音樂先驅。', url: 'https://www.youtube.com/results?search_query=Stockhausen' },
                { name: 'The Caretaker - Everywhere at the End of Time', description: '長達六小時，用音樂模擬失智症記憶逐漸衰退的恐怖實驗計畫。', url: 'https://www.youtube.com/results?search_query=The+Caretaker+Everywhere' },
                { name: 'Throbbing Gristle - 20 Jazz Funk Greats', description: '工業音樂 (Industrial) 的病態與極端開創者。', url: 'https://www.youtube.com/results?search_query=Throbbing+Gristle' }
            ]
        }
    ],

    '電影 (Movies)': [
        {
            id: 'mov_com', name: 'Comedy 喜劇片', score: 0, description: '輕鬆幽默，大眾娛樂的首選。', icon: '😂',
            items: [
                { name: 'The Hangover (醉後大丈夫)', description: '荒謬瘋狂的成人喜劇經典。', url: 'https://www.google.com/search?q=The+Hangover+Movie' },
                { name: 'Step Brothers (爛兄爛弟)', description: 'Will Ferrell 的無厘頭搞笑代表作。', url: 'https://www.google.com/search?q=Step+Brothers+Movie' },
                { name: '周星馳 - 功夫 (Kung Fu)', description: '華語無厘頭喜劇的視覺與笑料巔峰。', url: 'https://www.google.com/search?q=功夫+周星馳' },
                { name: 'Superbad (男孩我最壞)', description: '青春YA片與低俗喜劇的完美結合。', url: 'https://www.google.com/search?q=Superbad+Movie' },
                { name: 'Mr. Bean\'s Holiday (豆豆假期)', description: '肢體喜劇的跨語言經典。', url: 'https://www.google.com/search?q=Mr+Beans+Holiday' }
            ]
        },
        {
            id: 'mov_act', name: 'Action 動作片', score: 10, description: '腎上腺素飆升的打鬥與爆破。', icon: '💥',
            items: [
                { name: 'John Wick (捍衛任務)', description: '流暢暴力的現代槍戰動作標竿。', url: 'https://www.google.com/search?q=John+Wick' },
                { name: 'Mad Max: Fury Road (瘋狂麥斯：憤怒道)', description: '全程高能的末日飛車追逐神作。', url: 'https://www.google.com/search?q=Mad+Max+Fury+Road' },
                { name: 'Die Hard (終極警探)', description: '密閉空間動作片的永恆經典。', url: 'https://www.google.com/search?q=Die+Hard+Movie' },
                { name: 'The Matrix (駭客任務)', description: '結合科幻與東方武術的視覺革命。', url: 'https://www.google.com/search?q=The+Matrix' },
                { name: '成龍 - 警察故事 (Police Story)', description: '搏命演出與極限特技的香港動作典範。', url: 'https://www.google.com/search?q=警察故事+成龍' }
            ]
        },
        {
            id: 'mov_adv', name: 'Adventure 冒險片', score: 20, description: '探索未知領域與史詩旅程。', icon: '🗺️',
            items: [
                { name: 'Indiana Jones: Raiders of the Lost Ark (法櫃奇兵)', description: '考古冒險電影的絕對始祖。', url: 'https://www.google.com/search?q=Raiders+of+the+Lost+Ark' },
                { name: 'Jurassic Park (侏羅紀公園)', description: '科幻與冒險結合的恐龍奇觀。', url: 'https://www.google.com/search?q=Jurassic+Park' },
                { name: 'The Lord of the Rings (魔戒三部曲)', description: '奇幻冒險史詩難以超越的巔峰。', url: 'https://www.google.com/search?q=The+Lord+of+the+Rings' },
                { name: 'Jumanji (野蠻遊戲)', description: '奇異桌遊帶來失控的熱帶雨林大冒險。', url: 'https://www.google.com/search?q=Jumanji+Movie' },
                { name: 'The Goonies (七寶奇謀)', description: '經典的青少年尋寶冒險故事。', url: 'https://www.google.com/search?q=The+Goonies' }
            ]
        },
        {
            id: 'mov_sci', name: 'Science fiction / Sci-fi 科幻片', score: 40, description: '探討未來科技、外星與物理定律的極限。', icon: '🛸',
            items: [
                { name: 'Interstellar (星際效應)', description: '基於強大物理學設定的黑洞與愛之史詩。', url: 'https://www.google.com/search?q=Interstellar' },
                { name: 'Blade Runner 2049 (銀翼殺手2049)', description: '賽博龐克視覺與哲學探討的極致美學。', url: 'https://www.google.com/search?q=Blade+Runner+2049' },
                { name: 'Arrival (異星入境)', description: '探討語言學與線性時間的深度外星接觸。', url: 'https://www.google.com/search?q=Arrival+Movie' },
                { name: '2001: A Space Odyssey (2001太空漫遊)', description: '影史最偉大的硬科幻哲學開創者。', url: 'https://www.google.com/search?q=2001+A+Space+Odyssey' },
                { name: 'Children of Men (人類之子)', description: '一鏡到底長鏡頭呈現的末日未來反烏托邦。', url: 'https://www.google.com/search?q=Children+of+Men' }
            ]
        },
        {
            id: 'mov_thr', name: 'Thriller 驚悚片', score: 60, description: '高度緊張、懸疑與心理壓迫。', icon: '🔪',
            items: [
                { name: 'Se7en (火線追緝令)', description: '以七宗罪為主題，結局極度震撼的心理驚悚。', url: 'https://www.google.com/search?q=Se7en+Movie' },
                { name: 'Silence of the Lambs (沉默的羔羊)', description: '食人魔醫生與FBI探員的驚悚對決。', url: 'https://www.google.com/search?q=Silence+of+the+Lambs' },
                { name: 'Prisoners (私法爭鋒)', description: '探討道德底線的兒童綁架壓抑懸疑巨作。', url: 'https://www.google.com/search?q=Prisoners+Movie' },
                { name: 'Gone Girl (控制)', description: '婚姻背後的病態心理與完美犯罪算計。', url: 'https://www.google.com/search?q=Gone+Girl+Movie' },
                { name: 'Parasite (寄生上流)', description: '以黑色幽默包裝的階級對立驚悚寓言。', url: 'https://www.google.com/search?q=Parasite+Movie' }
            ]
        },
        {
            id: 'mov_hor', name: 'Horror 恐怖片', score: 75, description: '直視恐懼、超自然與極度不安的視覺。', icon: '👻',
            items: [
                { name: 'Hereditary (宿怨)', description: '近年來最令人打從心底發毛的家庭邪教恐怖片。', url: 'https://www.google.com/search?q=Hereditary+Movie' },
                { name: 'The Shining (鬼店)', description: '庫柏力克打造，密閉空間的心理崩潰恐怖經典。', url: 'https://www.google.com/search?q=The+Shining' },
                { name: 'The Exorcist (大法師)', description: '驅魔電影的始祖，帶來跨時代的恐懼。', url: 'https://www.google.com/search?q=The+Exorcist' },
                { name: '咒 (Incantation)', description: '台灣極度成功的偽紀錄片互動式邪教恐怖體驗。', url: 'https://www.google.com/search?q=咒+電影' },
                { name: 'The Babadook (巴巴杜)', description: '將創傷與憂鬱具象化為童書怪物的心理恐怖。', url: 'https://www.google.com/search?q=The+Babadook' }
            ]
        },
        {
            id: 'mov_art', name: 'Cult/Avant-Garde 邪典/前衛電影', score: 100, description: '極端非主流、怪異美學或極度暴力的地下神作。', icon: '🧠',
            items: [
                { name: 'Eraserhead (橡皮頭)', description: '大衛·林區充滿令人不安的工業環境與潛意識噩夢。', url: 'https://www.google.com/search?q=Eraserhead' },
                { name: 'Pink Flamingos (粉紅火鶴)', description: '刻意挑戰所有道德品味下限的「垃圾電影」極致。', url: 'https://www.google.com/search?q=Pink+Flamingos' },
                { name: 'The Holy Mountain (聖山)', description: '極端超現實、褻瀆與神祕學交織的迷幻邪典。', url: 'https://www.google.com/search?q=The+Holy+Mountain' },
                { name: 'Salò, or the 120 Days of Sodom (索多瑪120天)', description: '影史最惡名昭彰，挑戰忍受極限的絕望禁片。', url: 'https://www.google.com/search?q=Salo+120+Days+of+Sodom' },
                { name: 'Tetsuo: The Iron Man (鐵男)', description: '日本賽博龐克肉體恐怖的黑白金屬癲狂體驗。', url: 'https://www.google.com/search?q=Tetsuo+The+Iron+Man' }
            ]
        }
    ],

    '成人影音 (Adult Content)': [
        {
            id: 'ad_pop', name: '美女 / 少女 (Beautiful Woman/Idol)', score: 0, description: '主流審美，高顏值與柔美畫面為主的王道企劃。', icon: '💖',
            items: [
                { name: '三上悠亞 (Yua Mikami) 經典合集', description: '國民偶像轉型，最高規格與顏值的究極系列。', url: 'https://www.google.com/search?q=三上悠亞' },
                { name: '橋本有菜 (Arina Hashimoto) 腿美天花板', description: '被譽為奇蹟的長腿與高挑美女代表。', url: 'https://www.google.com/search?q=橋本有菜' },
                { name: '河北彩花 (Saika Kawakita) 復出神作', description: '清純與透明感的絕對王者。', url: 'https://www.google.com/search?q=河北彩花' },
                { name: 'S1 NO.1 STYLE 專屬企劃', description: '日本業界最頂級片商的招牌專屬系列。', url: 'https://s1s1s1.com/maker/s1' },
                { name: 'FALENO 頂級新星精選', description: '強調電影級4K畫質與新生代頂規美女。', url: 'https://faleno.jp/' }
            ]
        },
        {
            id: 'ad_jk', name: 'JK / 制服 (Schoolgirls/Uniforms)', score: 10, description: '滿足青春幻想，學生服與各種職業制服扮演。', icon: '👗',
            items: [
                { name: 'Kawaii 專屬水手服系列', description: '以清純女學生為主要設定的專門片商經典。', url: 'https://www.google.com/search?q=Kawaii+AV+Maker' },
                { name: 'SOD 青春時代群像劇', description: 'SOD 經常推出具有劇情設定的大規模制服企劃。', url: 'https://www.google.com/search?q=SOD+制服' },
                { name: '本庄鈴 (Suzu Honjo) 空服員系列', description: '氣質系女優轉職扮演高嶺之花職業的熱門作。', url: 'https://www.google.com/search?q=本庄鈴' },
                { name: '護理師/女醫 (Nurse) 密室診察', description: '醫院場景與性感護理服的經典角色扮演。', url: 'https://www.google.com/search?q=Nurse+AV' },
                { name: 'OL 辦公室微醺下班後', description: '套裝、絲襪與辦公室秘書設定的受歡迎主題。', url: 'https://www.google.com/search?q=OL+AV' }
            ]
        },
        {
            id: 'ad_boobs', name: '巨乳 (Large Breasts)', score: 20, description: '專注於極致豐滿身材與視覺衝擊。', icon: '🍉',
            items: [
                { name: 'MOODYZ 爆乳專屬精選', description: '業界大手 MOODYZ 旗下的神級巨乳女優特輯。', url: 'https://www.google.com/search?q=MOODYZ+爆乳' },
                { name: '沖田杏梨 (Anri Okita) 人類最強 Body', description: '以 J Cup 震撼業界的傳奇巨乳女優作品。', url: 'https://www.google.com/search?q=沖田杏梨' },
                { name: '宇都宮紫苑 (Shion Utsunomiya) 復刻', description: '神之乳名號，完美胸型與顏值的結合。', url: 'https://www.google.com/search?q=宇都宮紫苑' },
                { name: 'Oppai (片商) 專門企劃', description: '完全針對巨乳控設立的片商出品。', url: 'https://www.google.com/search?q=OPPAI+AV' },
                { name: 'Julia 絕美 J Cup 紀錄', description: '身材與性感兼具的長青樹天后代表作。', url: 'https://www.google.com/search?q=Julia+AV' }
            ]
        },
        {
            id: 'ad_ntr', name: '偷情 / NTR (Cheating/Cuckold)', score: 35, description: '背德感、人妻與強烈的情感背叛心理刺激。', icon: '🤫',
            items: [
                { name: 'Madonna (マドンナ) 高級人妻系列', description: '日本最專精於熟女與人妻背德劇情的頂級片商。', url: 'https://www.google.com/search?q=Madonna+AV' },
                { name: '寢取られ (NTR) 丈夫眼前企劃', description: '讓觀眾體驗強烈背叛與無力感的極端心理題材。', url: 'https://www.google.com/search?q=NTR+AV' },
                { name: '相澤南 (Minami Aizawa) 未亡人/人妻', description: '以精湛演技詮釋陷入禁忌戀情的小惡魔人妻。', url: 'https://www.google.com/search?q=相澤南' },
                { name: '上司與部下妻子的危險關係', description: '經典的職場與家庭交錯偷情劇本。', url: 'https://www.google.com/search?q=AV+人妻+偷情' },
                { name: '出差中的妻子 (Business Trip Betrayal)', description: '藉由遠距離產生的不倫戀曲設定。', url: 'https://www.google.com/search?q=出張+AV' }
            ]
        },
        {
            id: 'ad_multi', name: '多人 / 戶外 (Group/Outdoor)', score: 50, description: '突破傳統一對一與室內場景的狂放體驗。', icon: '🏕️',
            items: [
                { name: 'SOD 魔鏡號 (Magic Mirror Go)', description: '在繁華街頭進行，路人看不見內部的經典刺激戶外企劃。', url: 'https://www.google.com/search?q=魔鏡號' },
                { name: 'Giga (片商) 百人多P大混戰', description: '以極端人數與大場面混戰聞名的硬核企劃。', url: 'https://www.google.com/search?q=AV+多P' },
                { name: '露出 (Exhibitionism) 野外任務', description: '在公園、野外或車站的極限露出挑戰。', url: 'https://www.google.com/search?q=野外露出+AV' },
                { name: 'TMA 溫泉旅行合宿亂交', description: '結合旅遊與多人狂歡的情境作品。', url: 'https://www.google.com/search?q=AV+亂交+合宿' },
                { name: 'Sharehouse 共享公寓的秘密', description: '男女同居環境下發生的多人複雜關係。', url: 'https://www.google.com/search?q=Sharehouse+AV' }
            ]
        },
        {
            id: 'ad_fetish', name: '變態 / 肛交 (Hardcore/Anal/Fetish)', score: 75, description: '硬核、特定身體部位或痛覺等強烈感官刺激。', icon: '⛓️',
            items: [
                { name: 'Kink.com - Device Bondage', description: '歐美頂級工業級 BDSM、極端拘束與器具調教。', url: 'https://www.kink.com/' },
                { name: '溜池ゴロー (Goro Tameike) 導演名作', description: '專注於深喉嚨與極限開發的日本硬核名導。', url: 'https://www.google.com/search?q=溜池ゴロー' },
                { name: 'Anal (肛交) 初解禁系列', description: '專門紀錄女優首次挑戰後庭開發的強烈反應企劃。', url: 'https://www.google.com/search?q=AV+Anal+解禁' },
                { name: 'Attackers (片商) 絕望凌辱', description: '以極度黑暗暴力、洗腦與非自願設定聞名的極端片商。', url: 'https://www.google.com/search?q=Attackers+AV' },
                { name: 'Mute (無言) / 窒息邊緣', description: '挑戰呼吸控制與極端痛楚邊界的地下系列。', url: 'https://www.google.com/search?q=Hardcore+BDSM+AV' }
            ]
        },
        {
            id: 'ad_ex', name: '地下獵奇 / 異種 (Extreme Underground)', score: 100, description: '徹底遠離人類正常倫理與視覺承受極限的黑暗深淵。', icon: '☣️',
            items: [
                { name: 'Subversive Shibari Art (血腥繩縛)', description: '結合了自虐、針穿與極端懸吊的純粹痛楚藝術展演。', url: 'https://www.google.com/search?q=Extreme+Shibari' },
                { name: 'Guro / Snuff Mock (獵奇文化模擬)', description: '以極端血腥假漿果與斷肢設定進行的變態地下色情 (Gore)。', url: 'https://www.google.com/search?q=Guro+AV' },
                { name: '蟲姦 / 異種交配 CGI (Insects/Monsters)', description: '使用特效或真實無害昆蟲，挑戰人類本能噁心感的極端特攝。', url: 'https://www.google.com/search?q=Tentacle+Monster+AV' },
                { name: 'Coprophilia / Scat (黃金傳說)', description: '挑戰排泄物與極度反胃感官的極限癖好 (請勿輕易嘗試搜尋)。', url: 'https://www.google.com/search?q=Scat+AV' },
                { name: 'Deep Web Dark Archives (暗網流出模擬)', description: '刻意製作成極低畫質、充滿詭異儀式與精神污染的匿名上傳影片。', url: 'https://www.google.com/search?q=Creepy+Deep+Web+Porn' }
            ]
        }
    ],

    '動畫 (Animation)': [
        {
            id: 'ani_shonen', name: '熱血少年漫改 Shonen Anime', score: 0, description: '充滿熱血、戰鬥與友情的主流動畫。', icon: '🔥',
            items: [
                { name: '鬼滅之刃 (Demon Slayer)', description: '現象級熱血動畫，視覺效果頂尖。', url: 'https://www.youtube.com/results?search_query=鬼滅之刃' },
                { name: '進擊的巨人 (Attack on Titan)', description: '史詩級劇情與深刻的世界觀探討。', url: 'https://www.youtube.com/results?search_query=進擊的巨人' },
                { name: '咒術迴戰 (Jujutsu Kaisen)', description: '現代背景下的咒術與靈異戰鬥。', url: 'https://www.youtube.com/results?search_query=咒術迴戰' }
            ]
        },
        {
            id: 'ani_iyashi', name: '治癒系 / 日常 Iyashikei', score: 20, description: '溫暖人心、節奏平緩的放鬆之作。', icon: '🍃',
            items: [
                { name: '夏目友人帳', description: '人與妖怪之間溫馨而哀傷的故事。', url: 'https://www.youtube.com/results?search_query=夏目友人帳' },
                { name: '搖曳露營△', description: '極致放鬆的戶外露營與友誼。', url: 'https://www.youtube.com/results?search_query=搖曳露營' }
            ]
        }
    ],

    '連續劇 (TV Series)': [
        {
            id: 'tv_kdrama', name: '韓劇 K-Drama', score: 0, description: '引領全球潮流的韓國影視作品。', icon: '🇰🇷',
            items: [
                { name: '魷魚遊戲 (Squid Game)', description: '探討人性的極限生存遊戲。', url: 'https://www.youtube.com/results?search_query=魷魚遊戲' },
                { name: '黑暗榮耀 (The Glory)', description: '痛快淋漓的校園霸凌復仇劇。', url: 'https://www.youtube.com/results?search_query=黑暗榮耀' }
            ]
        },
        {
            id: 'tv_western', name: '美式影集 Western Series', score: 10, description: '高成本製作與多元題材的大型影集。', icon: '🇺🇸',
            items: [
                { name: '怪奇物語 (Stranger Things)', description: '80年代復古情懷與超自然冒險。', url: 'https://www.youtube.com/results?search_query=怪奇物語' },
                { name: '權力的遊戲 (Game of Thrones)', description: '史詩壯闊的奇幻權力爭霸。', url: 'https://www.youtube.com/results?search_query=權力的遊戲' }
            ]
        }
    ],

    '漫畫 (Manga)': [
        {
            id: 'man_popular', name: '少年漫畫 Popular Shonen', score: 0, description: '最受歡迎的雜誌連載漫畫作品。', icon: '📖',
            items: [
                { name: 'ONE PIECE 海賊王', description: '追尋夢想與自由的偉大航道冒險。', url: 'https://www.google.com/search?q=ONE+PIECE+Manga' },
                { name: '獵人 Hunter x Hunter', description: '極具層次的戰略與念能力對戰。', url: 'https://www.google.com/search?q=Hunter+x+Hunter+Manga' }
            ]
        },
        {
            id: 'man_webtoon', name: '條漫 / Webtoon', score: 20, description: '適配手機閱讀的彩色縱向漫畫。', icon: '📱',
            items: [
                { name: '女神降臨', description: '關於美醜與自我認同的戀愛故事。', url: 'https://www.google.com/search?q=女神降臨+Webtoon' },
                { name: '看臉時代', description: '校園霸凌與雙重人格的現實刻畫。', url: 'https://www.google.com/search?q=看臉時代+Webtoon' }
            ]
        }
    ],

    '新媒體 (New Media)': [
        {
            id: 'nm_vlog', name: '知識型 YouTube / VLOG', score: 0, description: '分享創意與知識的影音創作者。', icon: '📹',
            items: [
                { name: '老高與小茉 Mr & Mrs Gao', description: '有趣的世界未解之謎與科普。', url: 'https://www.youtube.com/@kuaishoutv' },
                { name: '志祺七七', description: '深度解析時事與社會議題。', url: 'https://www.youtube.com/@shidi77' }
            ]
        },
        {
            id: 'nm_game', name: '遊戲實況 / Twitch', score: 15, description: '即時互動的遊戲直播與社群文化。', icon: '🎮',
            items: [
                { name: '餐餐自由配 (魯蛋)', description: '資深實況主，獨特的遊戲見解與幽默。', url: 'https://www.twitch.tv/blusewilly_tw' },
                { name: 'Kai Cenat', description: '全球最熱門的創意生活實況主。', url: 'https://www.twitch.tv/kaicenat' }
            ]
        }
    ]
};

// Fallback generator for unmapped categories
function generateFallbackStyles(category, deviationIndex) {
    const scores = [0, 20, 40, 60, 80, 100];
    return scores.map(s => ({
        id: `unk_${s}`,
        name: `${category} (偏差 ${s}%)`,
        score: s,
        description: `基於 ${category}，跳脫舒適圈 ${s}% 的未知領域。`,
        icon: '🌌',
        items: Array.from({ length: 5 }).map((_, i) => ({
            name: `未知道具 ${s}-${i+1}`,
            description: `演算法為你尋找的 ${category} 具體事項。`,
            url: `https://www.google.com/search?q=${encodeURIComponent(category)}+${s}+${i+1}`
        }))
    }));
}


export function getRecommendedStyles(category, deviationIndex) {
    // 1. Get all available styles for the specific category
    let availableStyles = database[category];
    
    // Fallback if category not hardcoded in DB (e.g. Food, Books haven't fully expanded to 50 items here, but let's assume we handle them dynamically if missing)
    if (!availableStyles) {
       availableStyles = generateFallbackStyles(category, deviationIndex);
    }

    // 2. Sort available styles by how close their "score" is to the user's "deviationIndex"
    // Calculate distance (tolerance)
    const sortedStyles = [...availableStyles].sort((a, b) => {
        const distA = Math.abs(a.score - deviationIndex);
        const distB = Math.abs(b.score - deviationIndex);
        return distA - distB;
    });

    // 3. Return the exact top 5 closest styles
    return sortedStyles.slice(0, 5).map(style => {
        // We strip out the heavy `items` array to keep the React state lighter, 
        // though we can keep it. We'll leave it in for getSpecificItemsForStyle to find.
        return {
            id: style.id,
            name: style.name,
            score: style.score,
            description: style.description,
            icon: style.icon,
            _rawItems: style.items // Attach it hidden
        };
    });
}

export function getSpecificItemsForStyle(style, fullRecommendedArray = []) {
    // Since we attached `_rawItems` in getRecommendedStyles, we can just return it.
    // Ensure we always return exactly 5, if a list is shorter, slice or fallback.
    if (style && style._rawItems) {
        return style._rawItems.slice(0, 5);
    }

    // Extreme fallback
    return Array.from({length: 5}).map((_, i) => ({
        name: `發生錯誤的項目 ${i+1}`,
        description: `查無具體項目內容。`,
        url: 'https://google.com'
    }));
}
