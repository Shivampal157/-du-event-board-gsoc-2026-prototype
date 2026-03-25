import { useState } from "react";

export default function OrgAvatar({ orgName, orgLogo, size = 48 }) {
  const [broken, setBroken] = useState(false);
  const initials = (orgName || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!orgLogo || broken) {
    return (
      <span
        className="org-avatar org-avatar--fallback"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
        aria-hidden
      >
        {initials || "?"}
      </span>
    );
  }

  return (
    <img
      className="org-avatar org-avatar--img"
      src={orgLogo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  );
}
