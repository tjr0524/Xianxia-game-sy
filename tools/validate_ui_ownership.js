'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const post=read('runtime_postflight_v11_45_flat.js');
const ui=read('ui_runtime_v11_48.js');
const polish=read('ui_polish_v11_38.js');
const feedback=read('ui_feedback_v11_40.js');
const resultFlow=read('result_flow_v11_41.js');

if(!post.includes("loadScript('ui_runtime_v11_48.js','11.48.0'"))throw new Error('consolidated UI runtime is not loaded');
if(post.includes('ui_hygiene_v11_45.js'))throw new Error('legacy UI hygiene is still active');
if(post.includes('map_detail_v11_42.js'))throw new Error('legacy map detail patch is still active');
if(!post.includes("uiOwner:'ui-runtime-11.48'"))throw new Error('UI owner marker missing');

if(/new\s+MutationObserver/.test(ui))throw new Error('UI runtime must stay event-driven');
if(!ui.includes("setupPopover('training'"))throw new Error('training popover is not UI-runtime owned');
if(!ui.includes("setupPopover('map'"))throw new Error('map popover is not UI-runtime owned');
if(!ui.includes('moveRecordsToAreaTab()'))throw new Error('records ownership missing');
if(!ui.includes('sanitizeMapDetail()'))throw new Error('map detail sanitation ownership missing');
if(!ui.includes('normalizeClose('))throw new Error('close-button ownership missing');

const polishBoot=polish.slice(polish.indexOf('function boot(){'),polish.indexOf('\n\nboot();'));
if(polishBoot.includes('moveRecordsToExpedition()'))throw new Error('ui_polish still moves records');
if(polishBoot.includes('installDetailPopover('))throw new Error('ui_polish still owns popovers');
if(!polish.includes('node.dataset.v1140Label=label'))throw new Error('map label decoration is not co-located with map decoration');

const feedbackBoot=feedback.slice(feedback.indexOf('function boot(){'),feedback.indexOf('\n\nif(document.readyState'));
if(feedbackBoot.includes('moveRecordsToAreaTab()'))throw new Error('ui_feedback still moves records');
if(feedbackBoot.includes('ensureCompactPopover('))throw new Error('ui_feedback still owns popovers');
if(feedbackBoot.includes('observeMap()'))throw new Error('ui_feedback still observes map UI');

if(resultFlow.includes('requestAnimationFrame(frame)'))throw new Error('result flow still owns continuous RAF');
if(!resultFlow.includes("hub.subscribe('result-flow',frame,60)"))throw new Error('result flow is not on shared frame hub');

console.log('UI ownership validation: OK');
