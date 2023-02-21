!function(){"use strict";new class{constructor(){this.priceInputBoxElement=void 0,this.priceBoxDiscoveryInteral=void 0,this.floorPrice=void 0,this.thresholdPercentage=50;const e=document.createElement("iframe");e.src=chrome.runtime.getURL("index.html"),document.body.appendChild(e),this.setupPriceBoxDiscovery()}setupPriceBoxDiscovery(){this.priceBoxDiscoveryInteral=setInterval((()=>{let e=document.getElementsByClassName("sc-iJKOTD cDyuof");this.priceInputBoxElement&&0==e.length&&(this.priceInputBoxElement=void 0),e.length>0&&this.attachElementEventListeners(e[0])}),2e3)}attachElementEventListeners(e){var t,i,r,n,o,l;this.priceInputBoxElement=e;let d=this.priceInputBoxElement.innerText;try{this.floorPrice=+d;[...(null!==(l=null===(o=null===(n=null===(r=null===(i=null===(t=Array.from(document.querySelectorAll('[role="columnheader"]')).find((e=>"PROCEEDS"===e.innerText)))||void 0===t?void 0:t.parentElement)||void 0===i?void 0:i.parentElement)||void 0===r?void 0:r.children[1])||void 0===n?void 0:n.firstChild)||void 0===o?void 0:o.firstChild)&&void 0!==l?l:[]).children].forEach((e=>{var t;const i=[...e.children][e.children.length-1],r=new MutationObserver(((e,t)=>{var r,n,o,l,d;if("fat-finger-warning"==i.parentElement.lastChild.id){i.parentElement.removeChild(i.parentElement.lastChild),i.lastChild.style="";const e=null===(n=null===(r=Array.from(document.querySelectorAll('[transform="uppercase"]')).find((e=>"DURATION"===e.innerText)))||void 0===r?void 0:r.parentElement)||void 0===n?void 0:n.parentElement,t=document.getElementById("fat-finger-confirm-btn");e&&t&&e.removeChild(t)}const s=Array.from(null===(o=i.lastChild)||void 0===o?void 0:o.children).find((e=>"INPUT"==e.tagName)),a=Number(s.value);if(!Number.isNaN(a)&&this.isPriceOverThreshhold(a)){i.lastChild.style="border: 2px solid #ea4711";const e=`POTENTIAL FAT FINGER > ${this.getBreachedThresholdPercentage(a)}% ${this.isPositiveThreshold(Number(i.lastChild.firstChild.value))?"above":"below"} floor`,t=document.createElement("div");if(t.innerText=e,t.id="fat-finger-warning",t.style="position: fixed;z-index: 999999;width: 100%;height: 13px;background: #ea4711;top: 35px;left: 1px;font-size: 12px;padding-right: 8px;letter-spacing: -1px;font-weight: 900;color: black;text-align: right;font-family: 'Proto Mono';",i.parentElement.appendChild(t),!document.getElementById("fat-finger-confirm-btn")){const e=null===(d=null===(l=Array.from(document.querySelectorAll('[transform="uppercase"]')).find((e=>"DURATION"===e.innerText)))||void 0===l?void 0:l.parentElement)||void 0===d?void 0:d.parentElement,t=e.lastChild.cloneNode(!0);t.style="font-family: 'Proto Mono';position: fixed;width: 200px;opacity: 1;padding-top: 2px;cursor: pointer;text-transform: uppercase;",t.firstChild.style="line-height: 13px;",t.id="fat-finger-confirm-btn",t.innerText="confirm fat finger check",t.disabled=!1,t.addEventListener("click",(e=>{t.parentElement.removeChild(e.target)})),e.appendChild(t)}}})),n=Array.from(null===(t=i.lastChild)||void 0===t?void 0:t.children).find((e=>"INPUT"==e.tagName));r.observe(n,{attributes:!0,attributeFilter:["value"]}),i.addEventListener("input",(e=>{}))}))}catch(e){console.log(e)}}isPriceOverThreshhold(e){const t=(e-this.floorPrice)/this.floorPrice*100;return t>=this.thresholdPercentage||t<=-this.thresholdPercentage}getBreachedThresholdPercentage(e){const t=e-this.floorPrice;return Math.abs(Math.round(t/this.floorPrice*100))}isPositiveThreshold(e){return e-this.floorPrice>0}}}();