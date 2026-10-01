(() => {
  const repo = "ivan-s-2001/ShiftCalendar-Releases";
  const endpoint = `https://api.github.com/repos/${repo}/releases/latest`;

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const mb = bytes / 1024 / 1024;
    return `${mb.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} МБ`;
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  async function loadLatestRelease() {
    const buttons = [...document.querySelectorAll("[data-download-latest]")];
    const versionNodes = [...document.querySelectorAll("[data-release-version]")];
    const metaNodes = [...document.querySelectorAll("[data-release-meta]")];
    const statusNodes = [...document.querySelectorAll("[data-release-status]")];

    if (!buttons.length && !versionNodes.length && !metaNodes.length) return;

    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API: HTTP ${response.status}`);
      }

      const release = await response.json();
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const apk = assets.find((asset) =>
        typeof asset?.name === "string" &&
        asset.name.toLowerCase().endsWith(".apk")
      );

      if (!apk?.browser_download_url) {
        throw new Error("В последнем релизе пока нет APK");
      }

      const title = release.name || release.tag_name || "Последняя версия";
      const size = formatBytes(Number(apk.size));
      const published = formatDate(release.published_at);

      buttons.forEach((button) => {
        button.href = apk.browser_download_url;
        button.classList.remove("disabled");
        button.removeAttribute("aria-disabled");
        button.textContent = "Скачать APK";
      });

      versionNodes.forEach((node) => {
        node.textContent = title;
      });

      metaNodes.forEach((node) => {
        node.textContent = [size, published].filter(Boolean).join(" · ");
      });

      statusNodes.forEach((node) => {
        node.textContent = "APK загружается напрямую из GitHub Releases.";
      });
    } catch (error) {
      statusNodes.forEach((node) => {
        node.textContent =
          "Публичный релиз ещё готовится. Эта страница обновится после первой публикации APK.";
      });
    }
  }

  loadLatestRelease();
})();
