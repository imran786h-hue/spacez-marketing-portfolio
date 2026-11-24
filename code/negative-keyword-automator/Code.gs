// ================================================================
//  SPACEZ.CO - NEGATIVE KEYWORD AUTOMATOR v6
//  Updated 16 Nov 2026 for Imran (Marketing Manager)
//
//  WHAT CHANGED FROM v5
//  1. Bengaluru, Mumbai and Hyderabad are all HOME cities. Their names,
//     their areas and every Spacez villa name are never blocked.
//  2. "Certain only" rule. A term is blocked only when it is clearly not
//     our business: job, real estate, PG/hostel, long-term rent,
//     construction, support/login, or a far-away destination with no
//     home city in the search. Anything doubtful goes to the
//     "Needs Review" tab and is NOT applied.
//  3. Removed v5 rules that blocked our own customers: BHK searches,
//     homestay, cottage, farmhouse, price words ("cheap", "under 5000"),
//     Bengaluru areas (Yelahanka, Sarjapur, Hosur, Hebbal, E-City...),
//     Lonavala (Mount Amber), Nandi Hills.
//  4. Whole-word matching ("bali" no longer hits "balinese",
//     "goa" no longer hits "goregaon").
//  5. Safety: never blocks a term that converted in the last 30 days,
//     a term that is one of our live keywords, or a term already
//     negative in the campaign or a linked shared list.
//  6. Cross-city terms (e.g. "villa in hyderabad" inside a Bengaluru
//     campaign) are only logged for review by default.
//
//  HOW TO USE
//  DRY_RUN = true  -> writes PREVIEW rows to the sheet, changes nothing
//  DRY_RUN = false -> adds EXACT negatives at campaign level
//  Schedule: Daily, 11:00 AM IST
//
//  v6.1 (24 Nov 2026)
//  - A row says APPLIED only after Google Ads confirms the negative is
//    live in the campaign. Otherwise it says NOT LIVE.
//  - Every run re-checks old APPLIED rows. If a negative was removed in
//    Google Ads it becomes REMOVED BY YOU and is never added again.
//  - To undo a negative: type UNDO in its Status cell. Next run removes
//    it from the campaign and marks the row REMOVED BY YOU.
//  - PREVIEW rows no longer stop a term from being checked again.
//  - PMax terms go to Needs Review (scripts cannot add PMax negatives).
//    Add them by hand; the next run marks the row APPLIED.
// ================================================================

var CONFIG = {
  SHEET_URL       : 'YOUR_SHEET_URL',
  LOG_TAB         : 'Negative Keyword Log',
  REVIEW_TAB      : 'Needs Review',
  LOOKBACK_DAYS   : 1,     // new search terms from the last N days
  HISTORY_DAYS    : 30,    // a term with any conversion in this window is never blocked
  MIN_CLICKS      : 1,
  DRY_RUN       : false,  // switch to false after one clean preview
  MAX_PER_RUN     : 50,
  APPLY_CROSS_CITY: false  // true = also block a sister city inside a single-city campaign
};

// ----------------------------------------------------------------
//  HOME CITIES (all positive). Areas = where Spacez villas sit, from
//  spacez.co sitemap 16 Nov 2026, plus common local areas.
// ----------------------------------------------------------------
var CITIES = {
  BLR: {
    label: 'Bengaluru',
    campaignHints: ['bengaluru', 'bangalore', 'blr'],
    names: ['bangalore', 'bengaluru', 'banglore', 'bengalore', 'bangaluru', 'blr'],
    areas: ['begur', 'yelahanka', 'baiyappanahalli', 'brookefield', 'btm', 'btm layout',
      'cambridge layout', 'doddakannelli', 'domlur', 'gopasandra', 'harlur', 'hosur',
      'hsr', 'hsr layout', 'indiranagar', 'indira nagar', 'jakkur', 'jayanagar',
      'jp nagar', 'kammanahalli', 'kodihalli', 'koramangala', 'madavara', 'mg road',
      'rampura', 'rr nagar', 'sarjapur', 'sarjapura', 'whitefield', 'hebbal',
      'electronic city', 'e city', 'bannerghatta', 'kanakapura road', 'devanahalli',
      'marathahalli', 'bellandur', 'hennur', 'yeshwanthpur', 'malleshwaram',
      'banashankari', 'jalahalli', 'kr puram', 'hoodi', 'varthur', 'nandi hills',
      'airport road', 'outer ring road', 'mysore road', 'hosur road', 'tumkur road',
      'old madras road', 'bellary road']
  },
  MUM: {
    label: 'Mumbai',
    campaignHints: ['mumbai', 'mum', 'bombay'],
    names: ['mumbai', 'bombay', 'navi mumbai', 'thane'],
    areas: ['andheri', 'andheri west', 'chembur', 'goregaon', 'mulund', 'lonavala',
      'bandra', 'juhu', 'powai', 'malad', 'borivali', 'versova', 'khar', 'santacruz',
      'vile parle', 'worli', 'lokhandwala']
  },
  HYD: {
    label: 'Hyderabad',
    campaignHints: ['hyderabad', 'hyd'],
    names: ['hyderabad', 'hyd', 'secunderabad', 'cyberabad'],
    areas: ['kukatpally', 'bharat nagar', 'madhapur', 'shaikpet', 'gachibowli',
      'jubilee hills', 'banjara hills', 'hitech city', 'hitec city', 'kondapur',
      'kokapet', 'manikonda', 'financial district', 'nanakramguda', 'miyapur',
      'shamshabad', 'moinabad', 'gandipet', 'film nagar', 'tolichowki']
  }
};

// Every Spacez villa name (spacez.co sitemap, 16 Nov 2026). Never blocked.
var SPACEZ_PROPERTIES = [
  // Bengaluru
  'su casa', 'heritage hearth', 'vyoma luxe', 'modern mirage', 'magnum opus', 'mosaic manor',
  'namma morocco', 'orchid nirvana', 'serene springs', 'namma spruce', 'namma woodland',
  'vanta grove', 'villa saanchi', 'sterling manor', 'oasis courtyard', 'soul club',
  'mansion bay', 'waterfall manor', 'bohemian escapade', 'house of 2 trees',
  'house of two trees', 'jugglers rest', 'palm paradise', 'terra nest', 'vintage haven',
  'lucent elite', 'lucent luxe', 'lucent prime', 'twilight terrace', 'aurora heights',
  'gatsby grandeur', 'wooden whispers', 'bougain blossom', 'billionaires glasshouse',
  'billionaire glasshouse', 'billionaire glass house', 'billionaires glass house',
  'cascade castle', 'classic charm', 'garden bliss', 'garden glory', 'heritage haven',
  'regal sapphire', 'sunflower skyline', 'urban escape', 'vana vista', 'palm breeze',
  'cine castle', 'crystal hall', 'urban utopia', 'natures novelle', "nature's novelle",
  'nature novelle', 'silicon hideaway', 'casa blu', 'casa blue', 'lagoon luxe',
  'royal palms', 'metro nest', 'metronest', 'terra cota', 'deccan escape',
  // Hyderabad
  'ivory court', 'marigold manor', 'deccan heights', 'stellar skyline',
  // Mumbai
  'bollywood boulevard', 'bombay belvedere', 'pearl palace', 'peacock perch', 'soho nest',
  'garden veil', 'hilltop hideaway', 'timeless hearth', 'whispering stones', 'mount amber',
  'bombay breeze',
  // Brand and common misspellings
  'spacez', 'spacez co', 'space z', 'spacezz', 'spaces villa', 'space villa'
];

// ----------------------------------------------------------------
//  FAR-AWAY DESTINATIONS. Blocked only when the search has NO home
//  city, home area or villa name in it. Places near our cities that
//  could still be our guests (Nandi Hills, Karjat, Alibag, Kanakapura,
//  Mysore Road, Shamirpet...) are NOT here; they go to review.
// ----------------------------------------------------------------
var FAR_DESTINATIONS = [
  'coorg', 'madikeri', 'kushalnagar', 'chikmagalur', 'chikkamagaluru', 'sakleshpur',
  'ooty', 'coonoor', 'kodaikanal', 'yercaud', 'wayanad', 'munnar', 'alleppey', 'alappuzha',
  'varkala', 'kovalam', 'kumarakom', 'thekkady', 'gokarna', 'goa', 'calangute', 'baga',
  'anjuna', 'pondicherry', 'puducherry', 'mysore', 'mysuru', 'kabini', 'dandeli', 'hampi',
  'mangalore', 'udupi', 'manipal', 'murudeshwar', 'agumbe', 'manali', 'shimla',
  'mussoorie', 'rishikesh', 'nainital', 'dharamshala', 'kasol', 'jaipur', 'udaipur',
  'jaisalmer', 'agra', 'delhi', 'gurgaon', 'gurugram', 'noida', 'chandigarh', 'pune',
  'nashik', 'igatpuri', 'mahabaleshwar', 'panchgani', 'matheran', 'kerala', 'kochi',
  'cochin', 'trivandrum', 'chennai', 'mahabalipuram', 'kolkata', 'ahmedabad', 'surat',
  'vizag', 'visakhapatnam', 'araku', 'tirupati', 'bali', 'dubai', 'thailand', 'phuket',
  'bangkok', 'maldives', 'singapore', 'sri lanka', 'langkawi', 'vietnam'
];

// Places near our cities: never auto-blocked, logged for review.
var NEAR_BUT_UNSURE = [
  'nandi', 'karjat', 'alibag', 'alibaug', 'kanakapura', 'ramanagara', 'bidadi',
  'nelamangala', 'chikkaballapur', 'shamirpet', 'vikarabad', 'srisailam', 'ananthagiri'
];

// ----------------------------------------------------------------
//  CERTAIN JUNK. Each is a whole-word pattern that never means
//  "I want to book a villa stay".
// ----------------------------------------------------------------
var CERTAIN_JUNK = [
  { r: /\b(jobs?|careers?|hiring|vacanc(y|ies)|recruitment|internship|salary|walk.?in interview|fresher)\b/, c: 'Job search' },
  { r: /\b(for sale|on sale|resale|real estate|realestate|99acres|magicbricks|nobroker|housing\.com|square ?yards|sq ?ft|sqft|plots?|lakhs?|crores?|home loan|mortgage|ready to move|possession|new launch|pre.?launch|gated community|row house for sale)\b/, c: 'Real estate / property buying' },
  { r: /\b(buy|purchase|invest(ment)?)\b.*\b(villa|villas|house|home|flat|apartment|property|plot)\b/, c: 'Real estate / property buying' },
  { r: /\b(pg|paying guest|hostel|hostels|dormitory|dorm|co.?living|coliving|zolo|stanza living|nestaway)\b/, c: 'PG / hostel / coliving' },
  { r: /\b(monthly rent(al)?|rent per month|per month|long term rent(al)?|lease|to.?let|tolet|for rent monthly|annual rent|rental agreement)\b/, c: 'Long-term rental' },
  { r: /\b(flat|flats|apartment|apartments)\b.*\b(for rent|rent|on rent|to rent)\b/, c: 'Long-term rental' },
  { r: /\b(construction|contractor|architect|architecture|interior design(er)?|floor plan|elevation design|3d design|house plan|pool construction|pool maintenance|pool cleaning|pool repair|swimming (class|classes|lessons|coach|membership)|swimming pool membership)\b/, c: 'Construction / design / pool services' },
  { r: /\b(login|log in|sign in|signup|sign up|customer care|customer service|helpline|toll free|contact number|phone number|mobile number|refund|host login|owner login|list (my|your) property|become a host|franchise)\b/, c: 'Navigation / support' },
  { r: /\b(wikipedia|meaning|definition|pdf|ppt|wallpaper|clipart|sketch|png|lyrics|web series|trailer|full episode|apk|mod apk)\b/, c: 'Research / entertainment' },
  { r: /\b(oyo|treebo|fabhotel|fab hotel|zostel)\b/, c: 'Budget hotel brand' }
];


// ================================================================
//  MAIN
// ================================================================
function main() {
  Logger.log('=== Spacez Negative KW Automator v6 === ' + nowStr());
  Logger.log('Mode: ' + (CONFIG.DRY_RUN ? 'PREVIEW (nothing applied)' : 'LIVE'));

  var ss = SpreadsheetApp.openByUrl(CONFIG.SHEET_URL);
  var logSheet = getOrCreateTab(ss, CONFIG.LOG_TAB);
  var reviewSheet = getOrCreateTab(ss, CONFIG.REVIEW_TAB);
  processUndo(logSheet);
  auditApplied(logSheet);
  var alreadyLogged = readLoggedTerms([logSheet, reviewSheet]);

  var protectedTerms = loadLiveKeywords();
  var negatives = loadExistingNegatives();
  var converted = loadConvertedTerms();
  var terms = fetchSearchTerms();
  Logger.log('Search terms: ' + terms.length + ' | live keywords: ' + protectedTerms.size +
             ' | converted terms (30d): ' + converted.size);

  var block = [], review = [], seen = new Set();
  terms.forEach(function(t) {
    var key = t.campaign + '||' + t.term;
    if (seen.has(key)) return;
    seen.add(key);
    if (alreadyLogged.has(key) || alreadyLogged.has(t.term)) return;
    if (protectedTerms.has(t.term)) return;
    if (converted.has(t.term) || t.conversions > 0) return;
    if (isAlreadyNegative(negatives, t.campaign, t.term)) return;

    var verdict = judge(t.term, t.campaign);
    if (!verdict) return;
    t.reason = verdict.reason;
    if (verdict.action === 'BLOCK' && isPmax(t.campaign)) {
      t.reason = 'PMax: add by hand. ' + t.reason;   // scripts cannot add PMax negatives
      review.push(t);
    } else if (verdict.action === 'BLOCK') block.push(t); else review.push(t);
  });

  block.sort(function(a, b) { return b.clicks - a.clicks; });
  var rows = [], applied = 0;
  for (var i = 0; i < block.length && applied < CONFIG.MAX_PER_RUN; i++) {
    var b = block[i];
    var status = CONFIG.DRY_RUN ? 'PREVIEW'
               : (applyNegative(b.campaign, b.term) ? 'PENDING' : 'FAILED');
    rows.push([today(), nowTime(), b.term, '[' + b.term + ']', 'EXACT', b.campaign, b.adGroup,
               b.clicks, b.conversions, b.reason, status]);
    applied++;
  }
  // Confirm each new negative is really live before calling it APPLIED.
  rows.forEach(function(r) {
    if (r[10] !== 'PENDING') return;
    r[10] = isLiveNegative(r[5], r[2]) ? 'APPLIED' : 'NOT LIVE';
  });
  if (!rows.length) {
    rows.push([today(), nowTime(), '(clean)', '--', '--', '--', '--', 0, 0,
               'v6: nothing certain to block', CONFIG.DRY_RUN ? 'PREVIEW' : 'SKIPPED']);
  }
  appendRows(logSheet, rows);

  var rrows = review.map(function(r) {
    return [today(), nowTime(), r.term, '--', '--', r.campaign, r.adGroup, r.clicks,
            r.conversions, r.reason, 'REVIEW'];
  });
  if (rrows.length) appendRows(reviewSheet, rrows);

  Logger.log('Blocked/previewed: ' + applied + ' | sent to review: ' + rrows.length);
}


// ================================================================
//  DECISION
//  Returns null (leave alone), {action:'BLOCK'} or {action:'REVIEW'}
// ================================================================
function judge(term, campaignName) {
  if (hasAny(term, SPACEZ_PROPERTIES)) return null;

  var homeCities = campaignCities(campaignName);
  var mentioned = citiesMentioned(term);           // which home cities appear in the term

  // 1. Certain junk wins over everything except villa names.
  for (var i = 0; i < CERTAIN_JUNK.length; i++) {
    if (CERTAIN_JUNK[i].r.test(term)) return { action: 'BLOCK', reason: CERTAIN_JUNK[i].c };
  }

  // 2. Far-away destination with no home city/area at all.
  var far = firstMatch(term, FAR_DESTINATIONS);
  // "bali themed villa", "goa style villa", "kerala style house" = a look, not a place
  if (far && /\b(themed?|style|styled|inspired|type|like)\b/.test(term)) {
    return mentioned.length ? null : { action: 'REVIEW', reason: 'Style word with "' + far + '", unsure' };
  }
  if (far && mentioned.length === 0) {
    return { action: 'BLOCK', reason: 'Far destination: ' + far };
  }
  if (far && mentioned.length > 0) {
    return { action: 'REVIEW', reason: 'Far destination "' + far + '" but also mentions ' + mentioned.join('/') };
  }

  // 3. Near-by places we don't have villas in: review only.
  var near = firstMatch(term, NEAR_BUT_UNSURE);
  if (near && mentioned.length === 0) {
    return { action: 'REVIEW', reason: 'Near-city place, unsure: ' + near };
  }

  // 4. Sister city inside a single-city campaign.
  if (mentioned.length > 0 && homeCities.length === 1) {
    var other = mentioned.filter(function(c) { return homeCities.indexOf(c) === -1; });
    var own = mentioned.filter(function(c) { return homeCities.indexOf(c) > -1; });
    if (other.length && !own.length) {
      var why = 'Sister city ' + other.map(function(c) { return CITIES[c].label; }).join('/') +
                ' in ' + CITIES[homeCities[0]].label + ' campaign';
      return CONFIG.APPLY_CROSS_CITY ? { action: 'BLOCK', reason: why } : { action: 'REVIEW', reason: why };
    }
  }

  return null; // not certain -> leave it
}

function campaignCities(name) {
  var n = ' ' + (name || '').toLowerCase().replace(/[_\-]+/g, ' ') + ' ';
  var out = [];
  Object.keys(CITIES).forEach(function(k) {
    if (CITIES[k].campaignHints.some(function(h) { return wordIn(n, h); })) out.push(k);
  });
  return out.length ? out : Object.keys(CITIES); // unknown/multi-city = all three are home
}

function citiesMentioned(term) {
  var out = [];
  Object.keys(CITIES).forEach(function(k) {
    var c = CITIES[k];
    if (hasAny(term, c.names) || hasAny(term, c.areas)) out.push(k);
  });
  return out;
}


// ================================================================
//  DATA FROM THE ACCOUNT
// ================================================================
function fetchSearchTerms() {
  var range = dateRange(CONFIG.LOOKBACK_DAYS);
  var out = [];
  try {
    var it = AdsApp.search(
      'SELECT campaign.name, ad_group.name, search_term_view.search_term, metrics.clicks, ' +
      'metrics.all_conversions FROM search_term_view ' +
      'WHERE segments.date BETWEEN "' + range[0] + '" AND "' + range[1] + '" ' +
      'AND metrics.clicks >= ' + CONFIG.MIN_CLICKS + ' AND campaign.status = "ENABLED" ' +
      'AND search_term_view.status NOT IN ("EXCLUDED", "ADDED_EXCLUDED")');
    while (it.hasNext()) {
      var r = it.next();
      var t = norm(r.searchTermView.searchTerm);
      if (!t) continue;
      out.push({ term: t, campaign: r.campaign.name, adGroup: (r.adGroup && r.adGroup.name) || '--',
                 clicks: +r.metrics.clicks || 0, conversions: +r.metrics.allConversions || 0 });
    }
  } catch (e) { Logger.log('Search terms error: ' + e.message); }

  try {
    var pm = AdsApp.search(
      'SELECT campaign.name, campaign_search_term_view.search_term, metrics.clicks, ' +
      'metrics.all_conversions FROM campaign_search_term_view ' +
      'WHERE segments.date BETWEEN "' + range[0] + '" AND "' + range[1] + '" ' +
      'AND metrics.clicks >= ' + CONFIG.MIN_CLICKS + ' AND campaign.status = "ENABLED" ' +
      'AND campaign.advertising_channel_type = "PERFORMANCE_MAX"');
    while (pm.hasNext()) {
      var p = pm.next();
      var pt = norm(p.campaignSearchTermView.searchTerm);
      if (!pt) continue;
      out.push({ term: pt, campaign: p.campaign.name, adGroup: '--',
                 clicks: +p.metrics.clicks || 0, conversions: +p.metrics.allConversions || 0 });
    }
  } catch (e2) { Logger.log('PMax search terms not available here: ' + e2.message); }
  return out;
}

function loadConvertedTerms() {
  var range = dateRange(CONFIG.HISTORY_DAYS);
  var set = new Set();
  try {
    var it = AdsApp.search(
      'SELECT search_term_view.search_term, metrics.all_conversions FROM search_term_view ' +
      'WHERE segments.date BETWEEN "' + range[0] + '" AND "' + range[1] + '" ' +
      'AND metrics.all_conversions > 0');
    while (it.hasNext()) set.add(norm(it.next().searchTermView.searchTerm));
  } catch (e) { Logger.log('Converted terms error: ' + e.message); }
  return set;
}

function loadLiveKeywords() {
  var set = new Set();
  try {
    var it = AdsApp.search(
      'SELECT ad_group_criterion.keyword.text FROM ad_group_criterion ' +
      'WHERE ad_group_criterion.type = "KEYWORD" AND ad_group_criterion.negative = FALSE ' +
      'AND ad_group_criterion.status = "ENABLED" AND ad_group.status = "ENABLED" ' +
      'AND campaign.status = "ENABLED"');
    while (it.hasNext()) set.add(norm(it.next().adGroupCriterion.keyword.text));
  } catch (e) { Logger.log('Keywords error: ' + e.message); }
  return set;
}

// Map: campaign name -> Set of negative texts (campaign level + linked shared lists)
function loadExistingNegatives() {
  var byCampaign = {}, bySet = {};
  try {
    var c = AdsApp.search(
      'SELECT campaign.name, campaign_criterion.keyword.text FROM campaign_criterion ' +
      'WHERE campaign_criterion.type = "KEYWORD" AND campaign_criterion.negative = TRUE ' +
      'AND campaign.status = "ENABLED"');
    while (c.hasNext()) {
      var r = c.next();
      (byCampaign[r.campaign.name] = byCampaign[r.campaign.name] || new Set())
        .add(norm(r.campaignCriterion.keyword.text));
    }
  } catch (e) { Logger.log('Campaign negatives error: ' + e.message); }
  try {
    var s = AdsApp.search(
      'SELECT shared_set.id, shared_criterion.keyword.text FROM shared_criterion ' +
      'WHERE shared_set.type = "NEGATIVE_KEYWORDS" AND shared_set.status = "ENABLED"');
    while (s.hasNext()) {
      var x = s.next();
      (bySet[x.sharedSet.id] = bySet[x.sharedSet.id] || new Set()).add(norm(x.sharedCriterion.keyword.text));
    }
    var l = AdsApp.search(
      'SELECT campaign.name, shared_set.id FROM campaign_shared_set ' +
      'WHERE campaign_shared_set.status = "ENABLED" AND campaign.status = "ENABLED"');
    while (l.hasNext()) {
      var y = l.next(), set = bySet[y.sharedSet.id];
      if (!set) continue;
      var target = (byCampaign[y.campaign.name] = byCampaign[y.campaign.name] || new Set());
      set.forEach(function(v) { target.add(v); });
    }
  } catch (e2) { Logger.log('Shared lists error: ' + e2.message); }
  return byCampaign;
}

function isAlreadyNegative(map, campaign, term) {
  return !!(map[campaign] && map[campaign].has(term));
}

function applyNegative(campaignName, term) {
  try {
    var safe = campaignName.replace(/"/g, '\\"');
    var s = AdsApp.campaigns().withCondition('campaign.name = "' + safe + '"').get();
    if (s.hasNext()) { s.next().createNegativeKeyword('[' + term + ']'); return true; }
    var p = AdsApp.performanceMaxCampaigns().withCondition('campaign.name = "' + safe + '"').get();
    if (p.hasNext()) { p.next().createNegativeKeyword('[' + term + ']'); return true; }
    Logger.log('Campaign not found: ' + campaignName);
  } catch (e) { Logger.log('Apply error "' + term + '": ' + e.message); }
  return false;
}


// ================================================================
//  SHEET
// ================================================================
var HEADER = ['Date', 'Time (IST)', 'Search Term Triggered', 'Negative Keyword Added', 'Match Type',
              'Campaign', 'Ad Group', 'Clicks', 'Conversions', 'Reason', 'Status'];

function getOrCreateTab(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    var hr = sh.getRange(1, 1, 1, HEADER.length);
    hr.setValues([HEADER]).setBackground('#0d1b2a').setFontColor('#ffffff').setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Terms already handled: "campaign||term" for each row, plus bare term for APPLIED rows.
function readLoggedTerms(sheets) {
  var set = new Set();
  sheets.forEach(function(sh) {
    var last = sh.getLastRow();
    if (last < 2) return;
    var v = sh.getRange(2, 1, last - 1, 11).getValues();
    v.forEach(function(r) {
      var term = norm(String(r[2] || ''));
      if (!term || term.charAt(0) === '(') return;
      var st = String(r[10] || '').trim();
      if (st === 'PREVIEW' || st === 'NOT LIVE (old v5)') return;  // free to re-check
      set.add(String(r[5]) + '||' + term);
      if (st === 'APPLIED' || st === 'REMOVED BY YOU' || st === 'UNDO') set.add(term);
    });
  });
  return set;
}

// ----------------------------------------------------------------
//  LIVE CHECK, AUDIT AND UNDO
// ----------------------------------------------------------------
var PMAX_CACHE = null;
function isPmax(name) {
  if (!PMAX_CACHE) {
    PMAX_CACHE = {};
    try {
      var it = AdsApp.performanceMaxCampaigns().get();
      while (it.hasNext()) PMAX_CACHE[it.next().getName()] = true;
    } catch (e) { Logger.log('PMax list error: ' + e.message); }
  }
  return !!PMAX_CACHE[name];
}

function isLiveNegative(campaignName, term) {
  try {
    var q = 'SELECT campaign_criterion.criterion_id FROM campaign_criterion ' +
      'WHERE campaign_criterion.type = "KEYWORD" AND campaign_criterion.negative = TRUE ' +
      'AND campaign.name = "' + campaignName.replace(/"/g, '\\"') + '" ' +
      'AND campaign_criterion.keyword.text = "' + term.replace(/"/g, '\\"') + '"';
    return AdsApp.search(q).hasNext();
  } catch (e) { Logger.log('Live check error "' + term + '": ' + e.message); return false; }
}

var V6_START = new Date(2026, 10, 24);  // rows before 24 Nov 2026 came from old v5

function rowDate(v) {
  if (v instanceof Date) return v;
  var m = String(v || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
}

// Re-check every APPLIED row. Missing from the account -> mark it.
function auditApplied(sh) {
  var last = sh.getLastRow();
  if (last < 2) return;
  var v = sh.getRange(2, 1, last - 1, 11).getValues();
  var live = {};
  try {
    var it = AdsApp.search('SELECT campaign.name, campaign_criterion.keyword.text FROM campaign_criterion ' +
      'WHERE campaign_criterion.type = "KEYWORD" AND campaign_criterion.negative = TRUE ' +
      'AND campaign.status != "REMOVED"');
    while (it.hasNext()) {
      var x = it.next();
      live[x.campaign.name + '||' + norm(x.campaignCriterion.keyword.text)] = true;
    }
  } catch (e) { Logger.log('Audit error: ' + e.message); return; }
  var changed = 0;
  v.forEach(function(r, i) {
    var st = String(r[10]).trim();
    if (st !== 'APPLIED' && st !== 'NOT LIVE' && st !== 'FAILED') return;
    var term = norm(String(r[3] || '').replace(/^\[|\]$/g, ''));
    var isLive = !!live[String(r[5]) + '||' + term];
    if (st === 'NOT LIVE' || st === 'FAILED') {   // went live later or added by hand
      if (isLive) { sh.getRange(i + 2, 11).setValue('APPLIED'); changed++; }
      return;
    }
    if (isLive) return;
    var d = rowDate(r[0]);
    var label = (d && d >= V6_START) ? 'REMOVED BY YOU' : 'NOT LIVE (old v5)';
    sh.getRange(i + 2, 11).setValue(label);
    changed++;
  });
  Logger.log('Audit: ' + changed + ' APPLIED rows were not live and got relabelled');
}

// Rows where Imran typed UNDO in Status: remove the negative, mark the row.
function processUndo(sh) {
  var last = sh.getLastRow();
  if (last < 2) return;
  var v = sh.getRange(2, 1, last - 1, 11).getValues();
  v.forEach(function(r, i) {
    if (String(r[10]).trim().toUpperCase() !== 'UNDO') return;
    var term = norm(String(r[3] || r[2]).replace(/^\[|\]$/g, ''));
    var removed = 0;
    if (!CONFIG.DRY_RUN) {
      try {
        var c = AdsApp.campaigns().withCondition('campaign.name = "' + String(r[5]).replace(/"/g, '\\"') + '"').get();
        if (c.hasNext()) {
          var nk = c.next().negativeKeywords().get();
          while (nk.hasNext()) {
            var k = nk.next();
            if (norm(k.getText().replace(/^[\["]|[\]"]$/g, '')) === term) { k.remove(); removed++; }
          }
        }
      } catch (e) { Logger.log('Undo error "' + term + '": ' + e.message); }
    }
    sh.getRange(i + 2, 11).setValue(CONFIG.DRY_RUN ? 'UNDO' : 'REMOVED BY YOU');
    Logger.log('Undo "' + term + '" in ' + r[5] + ': removed ' + removed);
  });
}

function appendRows(sh, rows) {
  if (!rows.length) return;
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}


// ================================================================
//  HELPERS
// ================================================================
function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

function wordIn(text, phrase) {
  var p = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
  return new RegExp('(^|[^a-z0-9])' + p + '($|[^a-z0-9])').test(text);
}
function hasAny(text, list) { return list.some(function(p) { return wordIn(text, p); }); }
function firstMatch(text, list) {
  for (var i = 0; i < list.length; i++) if (wordIn(text, list[i])) return list[i];
  return null;
}

function dateRange(days) {
  var tz = 'Asia/Kolkata', end = new Date(), start = new Date();
  start.setDate(end.getDate() - days);
  return [Utilities.formatDate(start, tz, 'yyyy-MM-dd'), Utilities.formatDate(end, tz, 'yyyy-MM-dd')];
}
function today()   { return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy'); }
function nowTime() { return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'HH:mm:ss'); }
function nowStr()  { return today() + ' ' + nowTime(); }
