<!-- Black Friday banner component. Include this file with:
     <script src="/black-friday-banner.js" defer></script>
-->
(function () {
  "use strict";

  const bannerId = "awc-friday-banner";
  if (document.getElementById(bannerId)) return;

  const style = document.createElement("style");
  style.textContent = `
    #${bannerId}{position:fixed;top:0;left:0;width:100%;z-index:999999;background:#080808;color:#fff;padding:13px 20px;box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:none;transform:translateY(-110%);transition:transform .3s ease;box-shadow:0 3px 15px rgba(0,0,0,.2)}
    #${bannerId}.awc-visible{display:block;transform:translateY(0)}
    #${bannerId} .awc-content{max-width:1200px;margin:auto;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap}
    #${bannerId} .awc-message{font-size:14px;font-weight:600;letter-spacing:.3px;text-align:center}
    #${bannerId} .awc-highlight{color:#f5c46a;font-weight:800}
    #${bannerId} .awc-cta{display:inline-flex;align-items:center;justify-content:center;background:#fff;color:#080808;padding:8px 17px;border-radius:5px;text-decoration:none;font-size:13px;font-weight:700;transition:background .2s ease,color .2s ease}
    #${bannerId} .awc-cta:hover{background:#f5c46a;color:#080808}
    #${bannerId} .awc-close{position:absolute;right:18px;top:50%;transform:translateY(-50%);background:transparent;color:#fff;border:0;font-size:23px;cursor:pointer;line-height:1;padding:5px}
    #${bannerId} .awc-close:hover{color:#f5c46a}
    @media(max-width:600px){#${bannerId}{padding:12px 35px 12px 12px}#${bannerId} .awc-content{gap:9px}#${bannerId} .awc-message{font-size:12px;line-height:1.5}#${bannerId} .awc-cta{padding:7px 13px;font-size:12px}#${bannerId} .awc-close{right:8px;font-size:20px}}
    @media(prefers-reduced-motion:reduce){#${bannerId}{transition:none}}
  `;
  document.head.appendChild(style);

  const banner = document.createElement("div");
  banner.id = bannerId;
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Friday promotional offer");
  banner.innerHTML = `
    <div class="awc-content">
      <span class="awc-message">BLACK FRIDAY SALE | <span class="awc-highlight">GET 10% OFF</span> ON ALL SERVICES</span>
      <a class="awc-cta" href="https://api.whatsapp.com/send/?phone=919656778508&amp;text=Hello%2C%20I%20am%20interested%20in%20your%20services%20and%20would%20like%20to%20claim%20the%2010%25%20Friday%20offer." target="_blank" rel="noopener noreferrer">Claim Offer</a>
    </div>
    <button class="awc-close" type="button" aria-label="Close promotional banner">&times;</button>
  `;
  document.body.prepend(banner);

  const closeButton = banner.querySelector(".awc-close");
  const storageKey = "awc-friday-banner-dismissed";
  let originalPadding = "";

  function getIndiaDate() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    const values = {};
    parts.forEach(part => { values[part.type] = part.value; });
    return {
      weekday: values.weekday,
      date: `${values.year}-${values.month}-${values.day}`
    };
  }

  function hideBanner() {
    banner.classList.remove("awc-visible");
    banner.style.display = "none";
    if (banner.dataset.paddingApplied) {
      document.body.style.paddingTop = originalPadding;
      delete banner.dataset.paddingApplied;
    }
  }

  function updateBanner() {
    const indiaDate = getIndiaDate();
    let dismissedDate = null;
    try {
      dismissedDate = localStorage.getItem(storageKey);
    } catch (error) {
      // Keep the offer available if browser storage is disabled.
    }

    if (indiaDate.weekday === "Fri" && dismissedDate !== indiaDate.date) {
      banner.style.display = "block";
      banner.classList.add("awc-visible");
      if (!banner.dataset.paddingApplied) {
        originalPadding = document.body.style.paddingTop;
        document.body.style.paddingTop = `calc(${originalPadding || "0px"} + ${banner.offsetHeight}px)`;
        banner.dataset.paddingApplied = "true";
      }
    } else {
      hideBanner();
    }
  }

  closeButton.addEventListener("click", function () {
    try {
      localStorage.setItem(storageKey, getIndiaDate().date);
    } catch (error) {
      // The banner still closes for this visit when storage is disabled.
    }
    hideBanner();
  });

  updateBanner();
  window.setInterval(updateBanner, 60000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) updateBanner();
  });
  window.addEventListener("resize", function () {
    if (banner.dataset.paddingApplied) {
      document.body.style.paddingTop = originalPadding;
      document.body.style.paddingTop = `calc(${originalPadding || "0px"} + ${banner.offsetHeight}px)`;
    }
  });
})();
