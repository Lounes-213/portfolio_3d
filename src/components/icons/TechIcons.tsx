import type { SVGProps } from "react";

export type TechIconProps = SVGProps<SVGSVGElement> & { size?: number };

export const IconFlutter = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M14.3 2.5L3.5 13.3l3.3 3.3L20.8 2.5h-6.5z" fill="#02569B" />
    <path d="M14.3 12.2l-5.6 5.6 3.3 3.3 5.6-5.6-3.3-3.3z" fill="#0175C2" />
    <path d="M8.7 17.8l3.3 3.3 2.3-2.3-3.3-3.3-2.3 2.3z" fill="#29B6F6" />
    <path d="M14.3 21.1h6.5l-5.6-5.6-3.3 3.3 2.4 2.3z" fill="#02569B" />
  </svg>
);

export const IconDart = ({ size = 20, className, ...props }: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M4 14.5L9.5 20H15L7.5 12.5 4 14.5z" fill="#01579B" />
    <path d="M4 9.5L9.5 4H15L7.5 11.5 4 9.5z" fill="#00B0FF" />
    <path d="M9.5 4l10 10-4.5 4.5-10-10L9.5 4z" fill="#00838F" />
    <path d="M15 4h5v5l-10 10H5v-5L15 4z" fill="#00B4AB" />
  </svg>
);

export const IconAndroid = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.62 1.23 12.45 1 11.23 1s-2.39.23-3.41.63L6.34.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C5.12 3.32 3.88 5.23 3.65 7.5h16.7c-.23-2.27-1.47-4.18-3.82-5.34zM7 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
      fill="#3DDC84"
    />
  </svg>
);

export const IconPython = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M11.9 2c-3.1 0-4.9 1.4-4.9 3.2v2.3h5v.8H5.3C3.5 8.3 2 9.9 2 12.3c0 2.5 1.5 4 3.3 4h1.7v-2c0-2 1.7-3.7 3.7-3.7h5.1c1.6 0 3-1.3 3-3V5.2c0-1.8-1.8-3.2-4.9-3.2h-2zM9.5 3.9a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z"
      fill="#387EB8"
    />
    <path
      d="M12.1 22c3.1 0 4.9-1.4 4.9-3.2v-2.3h-5v-.8h6.7c1.8 0 3.3-1.6 3.3-4 0-2.5-1.5-4-3.3-4H17v2c0 2-1.7 3.7-3.7 3.7H8.2c-1.6 0-3 1.3-3 3v2.4c0 1.8 1.8 3.2 4.9 3.2h2zM14.5 20.1a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
      fill="#FFE052"
    />
  </svg>
);

export const IconNextjs = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" className="text-fg" />
    <path
      d="M15.5 8.5v7m-3.5-7v7m-4.5-7l8 10"
      stroke="var(--bg)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconReact = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      stroke="#61DAFB"
      strokeWidth="1.5"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      stroke="#61DAFB"
      strokeWidth="1.5"
      transform="rotate(60 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="10"
      ry="4"
      stroke="#61DAFB"
      strokeWidth="1.5"
      transform="rotate(120 12 12)"
    />
    <circle cx="12" cy="12" r="2" fill="#61DAFB" />
  </svg>
);

export const IconTypeScript = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="4" fill="#3178C6" />
    <path
      d="M11.5 8.5H5v2.2h2v7.8h2.3v-7.8h2.2V8.5zm3.8 6.7c.6.4 1.3.6 2 .6.8 0 1.2-.3 1.2-.7 0-.5-.4-.7-1.4-1.1-1.4-.5-2.3-1.1-2.3-2.4 0-1.3 1-2.3 2.7-2.3.9 0 1.7.2 2.3.6l-.6 1.8c-.5-.3-1.1-.5-1.7-.5-.7 0-1.1.3-1.1.7 0 .4.4.6 1.4 1 1.5.5 2.3 1.2 2.3 2.4 0 1.4-1.1 2.4-2.9 2.4-1 0-2-.3-2.7-.8l.9-1.7z"
      fill="#ffffff"
    />
  </svg>
);

export const IconTailwind = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M12 6c-3 0-4.5 1.5-4.5 4.5 0 2.2 1.1 3.5 2.2 4.5.8.7 1.5 1.3 1.8 2 0-3 1.5-4.5 4.5-4.5 2.2 0 3.5 1.1 4.5 2.2.7.8 1.3 1.5 2 1.8-3 0-4.5-1.5-4.5-4.5 0-2.2-1.1-3.5-2.2-4.5-.8-.7-1.5-1.3-1.8-2 0 3-1.5 4.5-4.5 4.5-2.2 0-3.5-1.1-4.5-2.2-.7-.8-1.3-1.5-2-1.8 1.8-.7 3.5-1 5.5-1z"
      fill="#38BDF8"
    />
  </svg>
);

export const IconPostgreSQL = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
      fill="#336791"
    />
  </svg>
);

export const IconFirebase = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M4.5 18.5L6.8 4.2c.1-.4.5-.6.8-.4l3.1 3.9-6.2 10.8z"
      fill="#FFA000"
    />
    <path
      d="M4.5 18.5l9.2-16.2c.2-.4.7-.4.9 0l9.1 16.2L12 23.5l-7.5-5z"
      fill="#F57C00"
    />
    <path
      d="M13.8 2.3c-.2-.4-.7-.4-.9 0l-2.2 4.4 2.2 4.4 3.8-6.6-2.9-2.2z"
      fill="#FFCA28"
    />
    <path
      d="M23.7 18.5L14.7 2.3c-.2-.4-.7-.4-.9 0l-3.1 5.5 13 10.7z"
      fill="#FFA000"
    />
  </svg>
);

export const IconSQLite = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect width="24" height="24" rx="4" fill="#003B57" />
    <text
      x="12"
      y="16"
      fill="#00B0FF"
      fontSize="8"
      fontWeight="900"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      SQL
    </text>
  </svg>
);

export const IconFastAPI = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#059669" />
    <path d="M13 3L6 13h5l-1 8 8-11h-5l1-7z" fill="#ffffff" />
  </svg>
);

export const IconJava = ({ size = 20, className, ...props }: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M8.5 17.5c2.5.5 5.5.5 7.5-.2 0 0-4.5 1.5-9 .2 0 0 1 .5 1.5 0zM7 19.5c3.2.5 7.3.5 10-.3 0 0-5.8 2-11.8.3 0 0 1.2.5 1.8 0zM12.5 3c-.8 2-2 3.5-2.5 5 .5-.2 1.5-.7 2-1.5.5 1.5.8 2.5 0 4.5 2-1 2.5-3 2.5-4-.5.5-1 1-1.5 1 .5-2 0-3.5-.5-5z"
      fill="#EA2D2E"
    />
    <path
      d="M16 11c1 .2 2 .8 1.8 1.8-.3 1-1.8 1.4-3.3 1.4.5-.4 1-.8 1-1.2 0-.8-.8-1-1.5-1.1.7-.5 1.5-.7 2-.9z"
      fill="#5382A1"
    />
  </svg>
);

export const IconR = ({ size = 20, className, ...props }: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <ellipse cx="12" cy="12" rx="10" ry="8" fill="#276DC3" />
    <text
      x="12"
      y="16"
      fill="#ffffff"
      fontSize="11"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      R
    </text>
  </svg>
);

export const IconWeb = ({ size = 20, className, ...props }: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M4 3h16l-1.5 15L12 21l-6.5-3L4 3z" fill="#E44D26" />
    <path d="M12 5v14l4.8-2.2 1.2-11.8H12z" fill="#F16529" />
    <path
      d="M8 8h8M8 11.5h7.5l-.5 4.5-3 1-3-1-.2-2"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconTikTok = ({
  size = 18,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.31 0 .61.05.88.15V9.78a5.674 5.674 0 0 0-.88-.07A5.69 5.69 0 1 0 15.54 15.4V8.81a7.35 7.35 0 0 0 4.46 1.49V7.21a4.27 4.27 0 0 1-3.4-1.39z"
      fill="currentColor"
    />
  </svg>
);

export const IconFacebook = ({
  size = 18,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      fill="currentColor"
    />
  </svg>
);

export const IconTensorFlow = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#FF6F00" opacity="0.2" />
    <path d="M12 2l9 5v10l-9 5V2z" fill="#FF6F00" />
    <path d="M12 2L3 7v10l9 5V2z" fill="#FFA000" />
    <path d="M12 7l4 2.5v5L12 17v-5l-4-2.5V7l4 2.5z" fill="#ffffff" />
  </svg>
);

export const IconOpenCV = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <circle cx="12" cy="7" r="4.5" fill="#EE2C2C" />
    <circle cx="7" cy="16" r="4.5" fill="#008000" />
    <circle cx="17" cy="16" r="4.5" fill="#0000EE" />
    <circle cx="12" cy="7" r="2" fill="#ffffff" />
    <circle cx="7" cy="16" r="2" fill="#ffffff" />
    <circle cx="17" cy="16" r="2" fill="#ffffff" />
  </svg>
);

export const IconStreamlit = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M14.5 4.5l-8 14.5H2l6.5-12 6 2v-4.5z" fill="#FF4B4B" />
    <path d="M22 19H9.5l6-11 6.5 11z" fill="#FF2B2B" />
  </svg>
);

export const IconPandas = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <rect x="4" y="4" width="6" height="6" rx="1.5" fill="#150458" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" fill="#E70488" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" fill="#E70488" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" fill="#150458" />
  </svg>
);

export const IconKotlin = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path d="M24 24H0V0h24L12 12l12 12z" fill="url(#kotlin-grad)" />
    <defs>
      <linearGradient
        id="kotlin-grad"
        x1="24"
        y1="0"
        x2="0"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E4485D" />
        <stop offset="0.46" stopColor="#C711E1" />
        <stop offset="1" stopColor="#7F52FF" />
      </linearGradient>
    </defs>
  </svg>
);

export const IconCloudflare = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M18.2 13.5c-.3-.9-1-1.6-1.9-1.9-.3-.1-.6-.1-.9-.1-.2-1.3-1-2.4-2.1-3.1-.7-.4-1.6-.7-2.5-.6-1.5.1-2.9.9-3.7 2.1-.3.5-.5 1.1-.6 1.7-.6.1-1.2.3-1.7.7-.6.5-1 1.2-1.1 2-.1.8.1 1.6.6 2.2.5.6 1.3 1 2.1 1h11.2c.8 0 1.6-.3 2.1-.9.5-.6.8-1.4.7-2.2-.1-.4-.3-.7-.5-1z"
      fill="#F38020"
    />
    <path
      d="M19.9 14.5c-.2-.7-.7-1.3-1.4-1.6-.1 0-.1 0 0 0 .3.4.4.9.4 1.4v.3c0 .1-.1.2-.2.2h-1.5c-.1 0-.2-.1-.2-.2v-.3c0-1.1-.9-2-2-2-.3 0-.6.1-.9.2-.1.1-.3 0-.3-.1-.3-.9-1-1.6-1.9-1.8-.1 0-.2-.1-.2-.2-.2-.6-.5-1.1-1-1.5-.1-.1-.1-.3 0-.4 1.5-.1 2.9.6 3.7 1.8.3.4.5.9.6 1.4.3 0 .6-.1.9-.1 1.2 0 2.2.8 2.5 2 .2.1.4.2.6.4.6.5.9 1.2.9 2 0 .2-.1.3-.3.3h-.7c-.1 0-.2-.1-.2-.2 0-.6-.3-1.2-.9-1.5z"
      fill="#FAAD3F"
    />
  </svg>
);

export const IconSupabase = ({
  size = 20,
  className,
  ...props
}: TechIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    {...props}
  >
    <path
      d="M13.2 22.8c-.5.6-1.5.3-1.6-.5l-.8-8.8h7.9c.8 0 1.2 1 .7 1.6l-6.2 7.7z"
      fill="#3ECF8E"
    />
    <path
      d="M10.8 1.2c.5-.6 1.5-.3 1.6.5l.8 8.8H5.3c-.8 0-1.2-1-.7-1.6l6.2-7.7z"
      fill="#3ECF8E"
      fillOpacity="0.8"
    />
  </svg>
);
