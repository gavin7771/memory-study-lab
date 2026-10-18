'use strict';
/* Research layer: data-driven profiles and dated evidence, preserving the original library. */
(() => {
  const U = window.MEMORY_UPGRADE;
  if (!U || !Array.isArray(U.vendors) || !U.market) return;
  const h = esc, M = U.market;
  const alias = { 'sk-hynix':'sk', skhynix:'sk', hynix:'sk', gigadevice:'gd' };
  const profiles = U.vendors.map(v => ({...v, id:alias[v.id] || v.id}));
  const getProfile = id => profiles.find(v => v.id === id);
  const list = xs => `<ul class="rx-list">${(xs || []).map(x=>`<li>${h(x)}</li>`).join('')}</ul>`;
  const tags = xs => `<div class="rx-tags">${(xs || []).map(x=>`<span>${h(x)}</span>`).join('')}</div>`;
  const links = xs => `<div class="rx-related">${xs.map(([url,t])=>`<a class="rx-anchor" href="${h(url)}">${h(t)} →</a>`).join('')}</div>`;
  const sourceList = xs => `<div class="rx-sources">${(xs || []).map(s=>`<a class="rx-source" href="${h(s.url)}" target="_blank" rel="noopener noreferrer"><strong>${h(s.title)} ↗</strong><small>${h(s.date || '官网未标注发布日期')} · 本次核验 2026-10-18</small></a>`).join('')}</div>`;
  const hero = (en,title,desc) => `<section class="rx-hero"><span>${en}</span><h1>${title}</h1><p>${h(desc)}</p><div class="rx-meta">公开资料整理 · 截至 ${h(M.asOf)} · 非实时报价</div></section>`;
  const researchNav = active => `<nav class="rx-nav" aria-label="研究路径">${[['#home','研究首页'],['#vendors','供应商画像'],['#market','行情观察'],['#research-compare','画像对照'],['#basics','基础知识']].map(([url,t])=>`<a href="${url}" ${active===url?'aria-current="page"':''}>${t}</a>`).join('')}</nav>`;
  const topicEntry = {DRAM:'dram',NAND:'nand',HBM:'hbm',NOR:'nor',SSD:'ssd','企业SSD':'cloudssd'};
  function profileCard(v) {
    return `<a class="rx-card" href="#vendor/${h(v.id)}"><div class="rx-topline"><span>${h(v.en)}</span><span>${h(v.role)}</span></div><h2>${h(v.name)}</h2><p>${h(v.summary)}</p>${tags(v.segments)}<div class="rx-card-foot"><span>定位 · 产品 · 观察变量</span><span>打开画像 →</span></div></a>`;
  }
  function profilePanel(v) {
    const relatedSignals = M.signals.filter(s=>v.segments.some(t=>s.segment.includes(t) || t==='SSD' && s.segment==='企业SSD'));
    return `<section class="rx-profile" aria-label="供应商画像总览"><div class="rx-profile-head"><span>SUPPLIER PROFILE / ${h(v.role)}</span><h2>${h(v.name)}：先看它在产业链中的位置</h2><p>${h(v.summary)}</p>${tags(v.segments)}<p class="rx-muted">画像核验 2026-10-18；技术节点、客户认证和交付状态请结合下方原始披露阅读。</p></div><div class="rx-two-col"><section><h3>产业定位</h3><p>${h(v.position)}</p><h3>产品覆盖</h3>${list(v.products)}</section><section><h3>能力与差异</h3>${list(v.strengths)}<h3>产业关系</h3><p>${h(v.relationships)}</p></section></div><div class="rx-two-col"><section><h3>风险与边界 <small>研究观察</small></h3>${list(v.risks)}</section><section><h3>下一步跟踪什么</h3>${list(v.watch)}</section></div><h3>画像依据</h3>${sourceList(v.sources)}<h3>从企业走向产品与行情</h3>${links([ ...v.segments.filter(t=>topicEntry[t]).map(t=>['#entry/'+topicEntry[t],t+' 原理与选型']), ...relatedSignals.slice(0,3).map(s=>['#market/'+s.id,s.segment+' 行情信号']), ['#research-compare/'+v.id,'与另一家供应商对照'] ])}<div class="rx-callout">继续向下阅读原有产品谱系、技术能力、关键决策与企业发展档案。画像是研究入口，不是供应商质量评级；采购仍须核对料号、资质、固件和客户验证。</div></section>`;
  }
  const originalVendor = vendor;
  vendor = function(id) {
    originalVendor(id);
    const v = getProfile(id);
    if (!v) return;
    const heading = main.querySelector('.page-head');
    if (heading) heading.insertAdjacentHTML('afterend', profilePanel(v));
    else main.insertAdjacentHTML('afterbegin', profilePanel(v));
  };
  const originalVendors = vendors;
  vendors = function(mode,selected) {
    if (mode === 'timeline' || mode === 'role' || mode === 'library') {
      originalVendors(mode==='library'?'cards':mode, selected);
      main.insertAdjacentHTML('afterbegin', researchNav('#vendors') + links([['#vendors','返回供应商画像']]));
      return;
    }
    main.innerHTML = hero('SUPPLIER INTELLIGENCE','供应商画像','不只看公司历史。把产业角色、产品能力、业务关系、风险与行情信号放在同一个研究入口。') + researchNav('#vendors') + `<div class="rx-kpis"><div><strong>${profiles.length}</strong><span>重点供应商画像</span></div><div><strong>${D.vendors.length}</strong><span>完整企业档案</span></div><div><strong>5</strong><span>产品研究入口</span></div></div><div class="rx-chain"><div><b>01 / 它是谁</b><p>原厂、设计、品牌、模组与主控分开看。</p></div><div><b>02 / 能做什么</b><p>用产品与公开证据理解差异，不做武断评分。</p></div><div><b>03 / 怎么跟踪</b><p>把认证、产能、终端需求接入行情观察。</p></div></div><div class="rx-filter"><label>搜索重点画像<input id="rxVendorQuery" type="search" placeholder="中文名、英文名、产品或技术…" autocomplete="off"></label><label>产品方向<select id="rxVendorSegment"><option value="all">全部产品</option>${['DRAM','NAND','HBM','NOR','SSD'].map(t=>`<option>${t}</option>`).join('')}</select></label></div><div id="rxVendorResults" aria-live="polite"></div><section class="rx-section"><h2>别把不同层级的公司混在一起</h2><p>存储晶圆原厂不等于主控厂，SSD 品牌也不必然自己制造 NAND。整机采购时还需看控制器、固件、认证与服务；不同产品方向的能力不能用一个总分概括。</p>${links([['#vendors/role/全部','完整企业目录与产业分工'],['#vendors/timeline','企业发展时间线'],['#compare','技术能力深度对照'],['#capacity','产能与项目档案'],['#atlas/world','制造地图']])}</section>`;
    filterProfiles();
  };
  function filterProfiles() {
    const box = document.getElementById('rxVendorResults'); if (!box) return;
    const q = (document.getElementById('rxVendorQuery')?.value || '').trim().toLowerCase();
    const segment = document.getElementById('rxVendorSegment')?.value || 'all';
    const selected = profiles.filter(v=>(segment==='all'||v.segments.includes(segment)) && (!q||JSON.stringify(v).toLowerCase().includes(q)));
    box.innerHTML = `<p class="rx-count">${selected.length} 家匹配供应商 / 共 ${profiles.length} 家重点画像</p>` + (selected.length ? `<div class="rx-grid">${selected.map(profileCard).join('')}</div>` : `<div class="rx-empty"><h2>暂时没有匹配的重点画像</h2><p>试试更短的名称，或切换全部产品。也可在完整企业目录中查找。</p>${links([['#vendors/role/全部','查看完整企业目录']])}</div>`);
  }
  const signalRelations = s => {
    let type = s.segment;
    if (type==='企业SSD') type='SSD';
    const vs = profiles.filter(v=>v.segments.includes(type));
    return links([...vs.slice(0,4).map(v=>['#vendor/'+v.id,v.name+' 画像']),['#entry/'+(topicEntry[s.segment]||'supply'),'理解 '+s.segment+' 的底层机制']]);
  };
  function signalCard(s) {
    return `<a class="rx-card" href="#market/${h(s.id)}"><div class="rx-topline"><span>${h(s.segment)}</span><span>有日期的证据</span></div><h2>${h(s.title)}</h2><p>${h(s.interpretation)}</p><p class="rx-muted">资料期间：${h(s.period)}</p><div class="rx-card-foot"><span>${h(s.sources.length)} 个公开依据</span><span>事实与边界 →</span></div></a>`;
  }
  function signalDetail(s) {
    return `<article class="rx-evidence"><div class="rx-topline"><span>${h(s.segment)}</span><span>${h(s.status)}</span></div><h2>${h(s.title)}</h2><p class="rx-muted">资料所述期间：${h(s.period)}</p><section class="rx-fact"><span class="rx-label">01 / 公开事实与原始预测</span><p>${h(s.fact)}</p></section><section class="rx-reading"><span class="rx-label">02 / 如何理解 · 编辑归纳</span><p>${h(s.interpretation)}</p></section><section class="rx-watch"><span class="rx-label">03 / 下一步验证</span><p>${h(s.watch)}</p></section><section class="rx-risk"><span class="rx-label">什么会推翻这个解释？</span><p>${h(s.risk)}</p></section><h3>回到原始资料</h3>${sourceList(s.sources)}<h3>关联供应商与技术词条</h3>${signalRelations(s)}</article>`;
  }
  market = function() {
    const id = location.hash.slice(1).split('/')[1];
    const selected = M.signals.find(s=>s.id===id);
    const nav = `<nav class="rx-signal-tabs" aria-label="行情信号分类"><a href="#market" ${!id?'aria-current="page"':''}>全部观察</a>${M.signals.map(s=>`<a href="#market/${h(s.id)}" ${s.id===id?'aria-current="page"':''}>${h(s.segment)}</a>`).join('')}</nav>`;
    main.innerHTML = hero('MARKET INTELLIGENCE','存储行情观察','先分清产品、期间与价格口径，再把需求、有效供给和厂商动作连成可验证的解释。') + researchNav('#market') + `<div class="rx-callout"><strong>这不是行情终端。</strong>未接入实时现货或合约报价，不提供个性化投资建议。截止日期表示本轮资料整理时间，不代表所有来源同时更新；每条信号保留自己的发布时点与观察期间。</div>` + nav;
    if (id && !selected) {
      main.innerHTML += `<div class="rx-empty"><h2>没有这条观察记录</h2>${links([['#market','返回全部观察']])}</div>`; return;
    }
    if (selected) {
      main.innerHTML += signalDetail(selected) + `<section class="rx-section"><h2>继续交叉验证</h2><div class="rx-grid">${M.signals.filter(s=>s.id!==id).slice(0,3).map(signalCard).join('')}</div></section>`;
      return;
    }
    main.innerHTML += `<section class="rx-section"><h2>当前值得拆开的六条线索</h2><p>${h(M.overview)}</p><div class="rx-grid">${M.signals.map(signalCard).join('')}</div></section><section class="rx-section"><h2>别把三种价格当成同一条曲线</h2><div class="rx-chain"><div><b>现货</b><p>小批、渠道与即时供需；先看规格、数量及交易口径。</p></div><div><b>合约</b><p>特定产品与协商周期；机构预测不是你的采购成交价。</p></div><div><b>企业 ASP</b><p>已实现的混合售价；产品组合与每 bit / 每颗口径会改变结果。</p></div></div>${links([['#entry/price','价格口径详解'],['#entry/financials','如何读原厂财报'],['#entry/inventory','库存口径与去化']])}</section><section class="rx-section"><h2>用什么验证，而不是只看结论</h2><div class="rx-table-wrap"><table><thead><tr><th>观察指标</th><th>要回答的问题</th><th>更新节奏</th><th>查哪里</th></tr></thead><tbody>${M.checklist.map(c=>`<tr><th>${h(c.metric)}</th><td>${h(c.meaning)}</td><td>${h(c.frequency)}</td><td>${h(c.source)}</td></tr>`).join('')}</tbody></table></div></section><section class="rx-section"><h2>三个条件情景，不给涨跌打包票</h2><p>以下是研究假设，不分配概率，不构成价格、股价或采购时点预测。</p><div class="rx-grid">${M.scenarios.map(s=>`<article class="rx-scenario"><h3>${h(s.title)}</h3><span class="rx-label">成立条件</span><p>${h(s.conditions)}</p><span class="rx-label">可能传导 · 非预测</span><p>${h(s.implication)}</p><span class="rx-label">失效条件</span><p>${h(s.invalidation)}</p></article>`).join('')}</div></section><section class="rx-section"><h2>把当前信号放回产业机制</h2><div class="rx-two-col">${M.explainers.map(x=>`<section><h3>${h(x.title)}</h3><p>${h(x.text)}</p></section>`).join('')}</div>${links([['#cycles','历史周期复盘'],['#capacity','产能证据与项目'],['#vendors','供应商画像'],['#entry/forecast','建立可更新的预测框架'],['./archive.html','原有研报与课程档案']])}</section>`;
  };
  function compareProfiles(left='samsung',right='sk') {
    const l=getProfile(left)||profiles[0], r=getProfile(right)||profiles.find(x=>x.id!==l.id)||profiles[0];
    main.innerHTML=hero('COMPARE THE BUSINESS, NOT A SCORE','供应商画像对照','同一套问题，并排看产业角色、产品覆盖、业务关系与待验证风险；不把不同技术和业务压成总分。')+researchNav('#research-compare')+`<div class="rx-compare">${[['rxCompareLeft','左侧供应商',l],['rxCompareRight','右侧供应商',r]].map(([id,label,v])=>`<label>${label}<select id="${id}">${profiles.map(x=>`<option value="${h(x.id)}" ${v.id===x.id?'selected':''}>${h(x.name)}</option>`).join('')}</select></label>`).join('')}</div>${l.id===r.id?'<div class="rx-callout">两侧选择了同一家供应商；切换任一侧可比较差异。</div>':''}<div class="rx-compare-grid">${[l,r].map(v=>`<article class="rx-card"><div class="rx-topline"><span>${h(v.en)}</span></div><h2>${h(v.name)}</h2><h3>产业角色</h3><p>${h(v.role)} · ${h(v.position)}</p><h3>产品覆盖</h3>${tags(v.segments)}${list(v.products)}<h3>能力差异</h3>${list(v.strengths)}<h3>业务关系</h3><p>${h(v.relationships)}</p><h3>风险与验证问题</h3>${list(v.risks)}${list(v.watch)}${sourceList(v.sources)}${links([['#vendor/'+v.id,'打开完整画像']])}</article>`).join('')}</div>${links([['#compare','进入原有技术机制深度对照'],['#vendors','返回供应商目录']])}`;
  }
  home = function() {
    main.innerHTML=hero('THE MEMORY RESEARCH DESK','存储百科 · 研究工作台','从一颗芯片，到一家企业，再到一轮供需周期。沿着同一条问题链阅读，而不是在零散页面之间来回找。')+researchNav('#home')+`<div class="rx-home-intro"><div><span class="rx-label">本轮升级 / RESEARCH EDITION</span><h2>供应商不是一段公司史。<br>行情也不只是一组涨幅。</h2><p>画像回答“谁在做、凭什么、看什么”；行情解释“发生了什么、为何重要、如何证伪”。每个入口都能继续走到技术、应用与原始来源。</p></div>${links([['#vendors','打开供应商画像'],['#market','进入行情观察']])}</div><div class="rx-kpis"><div><strong>${profiles.length}</strong><span>重点供应商画像</span></div><div><strong>${M.signals.length}</strong><span>分产品行情线索</span></div><div><strong>${D.entries.length}</strong><span>技术与应用词条</span></div><div><strong>${D.vendors.length}</strong><span>企业深度档案</span></div></div><section class="rx-section"><h2>从一个真实问题开始</h2><div class="rx-grid">${[['#vendors','01 / 产业角色','这家公司到底擅长什么？','看产品、能力、产业关系与风险，不只看成立年份。'],['#market','02 / 市场机制','为什么同是存储，景气不同？','把 DRAM、NAND、HBM 和企业 SSD 分开读。'],['#research-compare','03 / 横向研究','两家供应商有什么差别？','在统一问题下并排比较，不做缺乏证据的打分。'],['#apps','04 / 系统应用','同一颗芯片，为什么未必能替换？','回到工作负载、接口、耐久与工程验证。']].map(([url,n,t,d])=>`<a class="rx-card" href="${url}"><span class="rx-label">${n}</span><h2>${t}</h2><p>${d}</p><span class="rx-anchor">继续研究 →</span></a>`).join('')}</div></section><section class="rx-section"><h2>一条完整的阅读路径</h2><div class="rx-chain"><div><b>HBM 原理</b><p>先理解堆叠、带宽和容量。</p><a href="#entry/hbm">打开技术词条 →</a></div><div><b>三家供应商</b><p>再看产品、制造与客户导入差异。</p><a href="#research-compare/sk/micron">对照海力士与美光 →</a></div><div><b>行情验证</b><p>最后问资源分配如何影响供给。</p><a href="#market/${h(M.signals.find(s=>s.segment==='HBM')?.id||M.signals[0].id)}">查看 HBM 观察 →</a></div></div></section><section class="rx-section"><h2>值得继续跟踪</h2><div class="rx-grid">${M.signals.slice(0,3).map(signalCard).join('')}</div></section><section class="rx-section"><h2>原有知识，一处继续</h2>${links([['#basics','基础知识目录'],['#visuals/hbm','视觉图鉴'],['#atlas/world','全球制造地图'],['#capacity','产能档案'],['#cycles','历史周期'],['#history','产业全史'],['#sources','公开资料库'],['./archive.html','课程与研报档案']])}</section><p class="rx-muted">行情资料截至 ${h(M.asOf)}；非实时报价，不做个性化投资建议。所有预测保留发布时点。</p>`;
  };
  const oldSearch=search;
  search=function(q) {
    oldSearch(q);
    const terms=String(q).toLowerCase().trim().split(/\s+/).filter(Boolean);
    if(!terms.length)return;
    const vs=profiles.filter(v=>terms.every(t=>JSON.stringify(v).toLowerCase().includes(t)));
    const ss=M.signals.filter(s=>terms.every(t=>JSON.stringify(s).toLowerCase().includes(t)));
    if(vs.length||ss.length)main.insertAdjacentHTML('afterbegin',`<section class="rx-section"><h2>画像与行情专题 · ${vs.length+ss.length} 条</h2><div class="rx-grid">${vs.map(profileCard).join('')}${ss.map(signalCard).join('')}</div></section>`);
  };
  const oldSources=sources;
  sources=function(){oldSources(); const unique=new Map(); [...profiles.flatMap(v=>v.sources),...M.signals.flatMap(s=>s.sources)].forEach(s=>unique.set(s.url,s));main.insertAdjacentHTML('afterbegin',`<section class="rx-section"><h2>本轮画像与行情来源</h2><p>核验至2026-10-18 · ${unique.size} 个去重来源。官网无发布日期时仅标核验日期；企业披露、机构预测与编辑归纳在正文分别标识。</p>${sourceList([...unique.values()])}</section>`)};
  const previousRoute=route;
  route=function(scroll=true) {
    const p=location.hash.slice(1).split('/');
    if(p[0]==='research-compare') {
      compareProfiles(p[1],p[2]);
      document.title='供应商画像对照 · 存储百科';
      document.getElementById('breadcrumb').textContent='研究台 / 供应商画像对照';
      appSync();
      document.querySelectorAll('[data-app-tab]').forEach(a=>a.classList.toggle('selected',a.dataset.appTab==='vendors'));
      document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav==='vendors'));
      if(scroll)window.scrollTo({top:0,behavior:'instant'});
    } else previousRoute(scroll);
  };
  document.addEventListener('input',e=>{if(e.target.id==='rxVendorQuery')filterProfiles()});
  document.addEventListener('change',e=>{
    if(e.target.id==='rxVendorSegment')filterProfiles();
    if(['rxCompareLeft','rxCompareRight'].includes(e.target.id))location.hash='research-compare/'+document.getElementById('rxCompareLeft').value+'/'+document.getElementById('rxCompareRight').value;
  });
  cats.vendors[0]='供应商画像'; cats.vendors[2]='从产业角色、产品与技术能力到风险观察，建立完整供应商认识。';
  document.querySelectorAll('#sidebar a[data-nav="vendors"]').forEach(a=>{const span=a.querySelector('span');a.innerHTML=(span?span.outerHTML:'')+'供应商画像'});
  document.querySelector('.sidebar-foot p').innerHTML='知识有出处，判断有边界。<br>本轮资料核验 · 2026.10.18';
  const menu=document.querySelector('.sheet-links'); if(menu)menu.insertAdjacentHTML('afterbegin',`<a href="#research-compare">${appIcon('compare')}<span>供应商画像对照</span><b>›</b></a>`);
  route(false);
})();
