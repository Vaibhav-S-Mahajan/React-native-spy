import { r as requireReactDom, a as reactExports, z as zt, j as jsxRuntimeExports, u as useTheme } from "./index-DGhmHp_n.js";
var reactDomExports = requireReactDom();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
const ArrowDownUp = createLucideIcon("ArrowDownUp", [
  ["path", { d: "m3 16 4 4 4-4", key: "1co6wj" }],
  ["path", { d: "M7 20V4", key: "1yoxec" }],
  ["path", { d: "m21 8-4-4-4 4", key: "1c9v7m" }],
  ["path", { d: "M17 4v16", key: "7dpous" }]
]);
const ArrowDown = createLucideIcon("ArrowDown", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const ArrowUp = createLucideIcon("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
const Braces = createLucideIcon("Braces", [
  [
    "path",
    { d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1", key: "ezmyqa" }
  ],
  [
    "path",
    {
      d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
      key: "e1hn23"
    }
  ]
]);
const ChartColumn = createLucideIcon("ChartColumn", [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
]);
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const CircleX = createLucideIcon("CircleX", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
]);
const Clipboard = createLucideIcon("Clipboard", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
]);
const Code = createLucideIcon("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }]
]);
const Compass = createLucideIcon("Compass", [
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Database = createLucideIcon("Database", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
]);
const Download = createLucideIcon("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
const EllipsisVertical = createLucideIcon("EllipsisVertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const ExternalLink = createLucideIcon("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
const EyeOff = createLucideIcon("EyeOff", [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
]);
const FileCode2 = createLucideIcon("FileCode2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m5 12-3 3 3 3", key: "oke12k" }],
  ["path", { d: "m9 18 3-3-3-3", key: "112psh" }]
]);
const FileCode = createLucideIcon("FileCode", [
  ["path", { d: "M10 12.5 8 15l2 2.5", key: "1tg20x" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5", key: "yinavb" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z", key: "1mlx9k" }]
]);
const FileJson = createLucideIcon("FileJson", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
]);
const FilePlus2 = createLucideIcon("FilePlus2", [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M3 15h6", key: "4e2qda" }],
  ["path", { d: "M6 12v6", key: "1u72j0" }]
]);
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
const FolderOpen = createLucideIcon("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
const FolderSearch = createLucideIcon("FolderSearch", [
  [
    "path",
    {
      d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",
      key: "1bw5m7"
    }
  ],
  ["path", { d: "m21 21-1.9-1.9", key: "1g2n9r" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }]
]);
const Globe = createLucideIcon("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
]);
const HardDrive = createLucideIcon("HardDrive", [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
]);
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
const Link = createLucideIcon("Link", [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
]);
const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Palette = createLucideIcon("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);
const PlugZap = createLucideIcon("PlugZap", [
  [
    "path",
    { d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z", key: "goz73y" }
  ],
  ["path", { d: "m2 22 3-3", key: "19mgm9" }],
  ["path", { d: "M7.5 13.5 10 11", key: "7xgeeb" }],
  ["path", { d: "M10.5 16.5 13 14", key: "10btkg" }],
  ["path", { d: "m18 3-4 4h6l-4 4", key: "16psg9" }]
]);
const Plug = createLucideIcon("Plug", [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M9 8V2", key: "14iosj" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z", key: "osxo6l" }]
]);
const Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
const Radio = createLucideIcon("Radio", [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
]);
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const RotateCcw = createLucideIcon("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const Server = createLucideIcon("Server", [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2", key: "ngkwjq" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2", key: "iecqi9" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6", key: "16zg32" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18", key: "nzw8ys" }]
]);
const Settings = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const ShieldAlert = createLucideIcon("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);
const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
const Smartphone = createLucideIcon("Smartphone", [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
]);
const Table2 = createLucideIcon("Table2", [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
      key: "gugj83"
    }
  ]
]);
const Terminal = createLucideIcon("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
const TriangleAlert = createLucideIcon("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const WandSparkles = createLucideIcon("WandSparkles", [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
]);
const Wifi = createLucideIcon("Wifi", [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
]);
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const BTN_PRIMARY = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  height: 28,
  padding: "0 var(--space-3)",
  border: "none",
  borderRadius: "var(--radius-md)",
  background: "var(--accent-primary)",
  color: "var(--accent-fg)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-semibold)",
  fontFamily: "var(--font-ui)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  lineHeight: "var(--line-height-tight)",
  transition: "background-color 120ms ease"
};
const BTN_SECONDARY = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  height: 28,
  padding: "0 var(--space-3)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  background: "transparent",
  color: "var(--text-secondary)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "var(--font-ui)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  lineHeight: "var(--line-height-tight)",
  transition: "all 120ms ease"
};
const BTN_GHOST = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  height: 24,
  padding: "0 var(--space-2)",
  border: "none",
  borderRadius: "var(--radius-sm)",
  background: "transparent",
  color: "var(--text-tertiary)",
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "var(--font-ui)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  lineHeight: "var(--line-height-tight)",
  transition: "all 120ms ease"
};
const BTN_DANGER = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  height: 28,
  padding: "0 var(--space-3)",
  border: "1px solid var(--status-danger-border)",
  borderRadius: "var(--radius-md)",
  background: "var(--status-danger-bg)",
  color: "var(--status-danger-text)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "var(--font-ui)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  lineHeight: "var(--line-height-tight)",
  transition: "all 120ms ease"
};
const INPUT_BASE = {
  height: 28,
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-default)",
  background: "var(--bg-input)",
  color: "var(--text-primary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-mono)",
  outline: "none",
  lineHeight: "var(--line-height-tight)",
  transition: "border-color 120ms ease"
};
const BADGE = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  padding: "2px var(--space-2)",
  borderRadius: "var(--radius-sm)",
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-weight-medium)",
  border: "1px solid transparent",
  lineHeight: "var(--line-height-tight)"
};
const BADGE_SUCCESS = {
  ...BADGE,
  background: "var(--status-success-bg)",
  color: "var(--status-success-text)",
  borderColor: "var(--status-success-border)"
};
const BADGE_WARNING = {
  ...BADGE,
  background: "var(--status-warning-bg)",
  color: "var(--status-warning-text)",
  borderColor: "var(--status-warning-border)"
};
const BADGE_DANGER = {
  ...BADGE,
  background: "var(--status-danger-bg)",
  color: "var(--status-danger-text)",
  borderColor: "var(--status-danger-border)"
};
const BADGE_INFO = {
  ...BADGE,
  background: "var(--status-info-bg)",
  color: "var(--status-info-text)",
  borderColor: "var(--status-info-border)"
};
const SECTION_LABEL = {
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "var(--font-ui)",
  color: "var(--text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  lineHeight: "var(--line-height-tight)"
};
const EMPTY_STATE = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--space-2)",
  color: "var(--text-tertiary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-ui)"
};
const FILE_LOC_RE = /(?:^|[()\s])([A-Za-z]:[\\/][^\s:()]+|\/?(?:[\w.@\-]+\/)*[\w.@\-]+\.\w{1,10})(?::(\d+))?(?::(\d+))?/g;
function parseLocations(text) {
  if (!text || typeof text !== "string") return null;
  const segments = [];
  let lastIndex = 0;
  FILE_LOC_RE.lastIndex = 0;
  let match;
  while ((match = FILE_LOC_RE.exec(text)) !== null) {
    const file = match[1];
    const line = match[2] ? parseInt(match[2], 10) : 1;
    const col = match[3] ? parseInt(match[3], 10) : 1;
    const fullMatch = match[0];
    const beforeIdx = match.index;
    const before2 = text.slice(Math.max(0, beforeIdx - 8), beforeIdx + fullMatch.indexOf(file));
    if (/https?:\/\/|wss?:\/\/|data:|blob:/i.test(before2)) continue;
    if (/node_modules/.test(file) && !/node_modules\/@/.test(file)) continue;
    const matchStart = match.index + fullMatch.indexOf(file);
    const matchEnd = matchStart + file.length + (match[2] ? 1 + match[2].length : 0) + (match[3] ? 1 + match[3].length : 0);
    if (matchStart > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, matchStart) });
    }
    segments.push({
      type: "link",
      value: text.slice(matchStart, matchEnd),
      file,
      line,
      col
    });
    lastIndex = matchEnd;
  }
  if (!segments.length) return null;
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}
function ClickablePath({ text, color, openInEditor }) {
  const segments = reactExports.useMemo(() => parseLocations(text), [text]);
  const handleClick = reactExports.useCallback((file, line, col) => {
    if (!openInEditor) return;
    openInEditor(file, line, col).then((res) => {
      if (res && !res.ok && res.reason === "not-found") {
        zt.error(
          "VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH",
          { duration: 5e3 }
        );
      }
    });
  }, [openInEditor]);
  if (!segments) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: text });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: segments.map((seg, i) => {
    if (seg.type === "text") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: seg.value }, i);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      PathLink,
      {
        display: seg.value,
        file: seg.file,
        line: seg.line,
        col: seg.col,
        color,
        onClick: handleClick
      },
      i
    );
  }) });
}
function PathLink({ display, file, line, col, color, onClick }) {
  const [hover, setHover] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      role: "button",
      tabIndex: 0,
      onClick: (e) => {
        e.stopPropagation();
        onClick(file, line, col);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter") onClick(file, line, col);
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        color: hover ? "var(--text-link)" : color || "var(--text-link)",
        textDecoration: hover ? "underline" : "none",
        cursor: "pointer",
        borderRadius: 2,
        transition: "color 80ms ease"
      },
      title: `Open ${file}:${line}:${col} in VS Code`,
      children: display
    }
  );
}
function CursorMenu({ anchor, onClose, children, width }) {
  const menuRef = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState(null);
  reactExports.useLayoutEffect(() => {
    if (!anchor) return;
    const el = menuRef.current;
    const w = el?.offsetWidth || 240;
    const h = el?.offsetHeight || 300;
    const pad = 6;
    let left = anchor.x;
    let top = anchor.y;
    if (left + w + pad > window.innerWidth) left = Math.max(pad, window.innerWidth - w - pad);
    if (top + h + pad > window.innerHeight) top = Math.max(pad, window.innerHeight - h - pad);
    setPos({ top, left });
  }, [anchor]);
  reactExports.useEffect(() => {
    if (!anchor) return void 0;
    let active = false;
    const frame = requestAnimationFrame(() => {
      active = true;
    });
    const onDown = (e) => {
      if (!active) return;
      if (!menuRef.current?.contains(e.target)) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onContext = (e) => {
      if (!active) return;
      if (!menuRef.current?.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onClose, true);
    document.addEventListener("contextmenu", onContext, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onClose, true);
      document.removeEventListener("contextmenu", onContext, true);
    };
  }, [anchor, onClose]);
  if (!anchor) return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: menuRef,
        className: "animate-fade-in",
        style: {
          position: "fixed",
          top: pos?.top ?? anchor.y,
          left: pos?.left ?? anchor.x,
          zIndex: 1300,
          minWidth: width || 240,
          maxHeight: "calc(100vh - 24px)",
          overflowY: "auto",
          padding: "var(--space-1)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-default)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-lg)"
        },
        children
      }
    ),
    document.body
  );
}
function MenuLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    padding: "5px var(--space-2) 3px",
    fontSize: 10,
    fontWeight: "var(--font-weight-semibold)",
    fontFamily: "var(--font-ui)",
    color: "var(--text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    lineHeight: "var(--line-height-tight)",
    userSelect: "none"
  }, children });
}
function MenuItem({ icon, label, onClick, danger, disabled, hint }) {
  const [hover, setHover] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      disabled,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        width: "100%",
        padding: "5px var(--space-2)",
        border: "none",
        borderRadius: "var(--radius-sm)",
        background: hover && !disabled ? "var(--bg-card-hover)" : "transparent",
        color: disabled ? "var(--text-tertiary)" : danger ? "var(--status-danger-text)" : "var(--text-secondary)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--font-weight-medium)",
        fontFamily: "var(--font-ui)",
        cursor: disabled ? "default" : "pointer",
        textAlign: "left",
        lineHeight: "var(--line-height-tight)"
      },
      children: [
        icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "flex", flexShrink: 0, width: 14, justifyContent: "center" }, children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, whiteSpace: "nowrap" }, children: label }),
        hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: hint })
      ]
    }
  );
}
function MenuDivider() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: 1, background: "var(--border-subtle)", margin: "3px 2px" } });
}
function LevelChip({ active, color, dot, icon, label, badge, onClick, title }) {
  const [hover, setHover] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      title,
      "aria-pressed": active,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 24,
        padding: "0 11px",
        border: "none",
        borderRadius: 999,
        background: active ? `linear-gradient(180deg,
              color-mix(in srgb, ${color} 18%, transparent),
              color-mix(in srgb, ${color} 10%, transparent))` : hover ? "var(--bg-card)" : "transparent",
        boxShadow: active ? `inset 0 0 0 1px color-mix(in srgb, ${color} 55%, transparent),
             0 1px 8px color-mix(in srgb, ${color} 20%, transparent)` : `inset 0 0 0 1px ${hover ? "var(--border-default)" : "var(--border-subtle)"}`,
        color: active ? color : hover ? "var(--text-secondary)" : "var(--text-tertiary)",
        fontSize: 11,
        fontWeight: "var(--font-weight-semibold)",
        letterSpacing: "0.02em",
        fontFamily: "var(--font-ui)",
        cursor: "pointer",
        lineHeight: 1,
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 140ms ease"
      },
      children: [
        icon ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", style: { display: "inline-flex", alignItems: "center", flexShrink: 0 }, children: icon }) : dot ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            "aria-hidden": "true",
            style: {
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: active ? dot : "var(--text-tertiary)",
              opacity: active ? 1 : 0.55,
              boxShadow: active ? `0 0 6px color-mix(in srgb, ${dot} 80%, transparent)` : "none",
              transition: "all 140ms ease"
            }
          }
        ) : null,
        label,
        badge
      ]
    }
  );
}
function shellQuote(str) {
  return `'${String(str).replace(/'/g, `'\\''`)}'`;
}
function psQuote(str) {
  return `"${String(str).replace(/"/g, '`"').replace(/\$/g, "`$")}"`;
}
function headerEntries(headers) {
  if (!headers) return [];
  if (typeof headers === "object" && !Array.isArray(headers)) return Object.entries(headers);
  return [];
}
function bodyToString(body) {
  if (!body) return "";
  if (typeof body === "string") return body;
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}
function toCurl(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  const parts = [`curl ${shellQuote(req.url)}`];
  if (method !== "GET") parts.push(`  -X ${method}`);
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  -H ${shellQuote(`${k}: ${v}`)}`);
  }
  const body = bodyToString(req.requestBody);
  if (body) parts.push(`  --data-raw ${shellQuote(body)}`);
  return parts.join(" \\\n");
}
function toCurlPowerShell(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  const parts = [`curl.exe ${psQuote(req.url)}`];
  if (method !== "GET") parts.push(`  -X ${method}`);
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  -H ${psQuote(`${k}: ${v}`)}`);
  }
  const body = bodyToString(req.requestBody);
  if (body) parts.push(`  --data-raw ${psQuote(body)}`);
  return parts.join(" `\n");
}
function toFetch(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  const opts = {};
  if (method !== "GET") opts.method = method;
  if (req.requestHeaders && Object.keys(req.requestHeaders).length) {
    opts.headers = req.requestHeaders;
  }
  const body = bodyToString(req.requestBody);
  if (body) opts.body = body;
  const optsStr = Object.keys(opts).length ? `, ${JSON.stringify(opts, null, 2)}` : "";
  return `fetch(${JSON.stringify(req.url)}${optsStr})`;
}
function toNodeFetch(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  const lines = [];
  lines.push(`const response = await fetch(${JSON.stringify(req.url)}, {`);
  if (method !== "GET") lines.push(`  method: ${JSON.stringify(method)},`);
  if (req.requestHeaders && Object.keys(req.requestHeaders).length) {
    lines.push(`  headers: ${JSON.stringify(req.requestHeaders, null, 4).split("\n").map((l, i) => i === 0 ? l : "  " + l).join("\n")},`);
  }
  const body = bodyToString(req.requestBody);
  if (body) lines.push(`  body: ${JSON.stringify(body)},`);
  lines.push(`});`);
  lines.push(`const data = await response.json();`);
  return lines.join("\n");
}
function toAxios(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toLowerCase();
  const hasBody = method === "post" || method === "put" || method === "patch";
  const body = bodyToString(req.requestBody);
  const headers = req.requestHeaders && Object.keys(req.requestHeaders).length ? req.requestHeaders : null;
  const lines = [];
  if (hasBody && body) {
    const config = headers ? `, {
  headers: ${JSON.stringify(headers, null, 4).split("\n").map((l, i) => i === 0 ? l : "  " + l).join("\n")}
}` : "";
    let bodyArg;
    try {
      JSON.parse(body);
      bodyArg = body;
    } catch {
      bodyArg = JSON.stringify(body);
    }
    lines.push(`const { data } = await axios.${method}(${JSON.stringify(req.url)}, ${bodyArg}${config});`);
  } else {
    const config = headers ? `, {
  headers: ${JSON.stringify(headers, null, 4).split("\n").map((l, i) => i === 0 ? l : "  " + l).join("\n")}
}` : "";
    lines.push(`const { data } = await axios.${method}(${JSON.stringify(req.url)}${config});`);
  }
  return lines.join("\n");
}
function toHttpie(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  const parts = [`http ${method} ${shellQuote(req.url)}`];
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    parts.push(`  ${k}:${shellQuote(v)}`);
  }
  const body = bodyToString(req.requestBody);
  if (body) {
    try {
      const parsed = JSON.parse(body);
      for (const [k, v] of Object.entries(parsed)) {
        parts.push(`  ${k}=${JSON.stringify(v)}`);
      }
    } catch {
      parts.push(`  --raw ${shellQuote(body)}`);
    }
  }
  return parts.join(" \\\n");
}
function toRawHttp(req) {
  if (!req || !req.url) return "";
  const method = (req.method || "GET").toUpperCase();
  let path = "/";
  let host = "";
  try {
    const u = new URL(req.url);
    path = u.pathname + u.search;
    host = u.host;
  } catch {
  }
  const lines = [`${method} ${path} HTTP/1.1`];
  lines.push(`Host: ${host}`);
  for (const [k, v] of headerEntries(req.requestHeaders)) {
    lines.push(`${k}: ${v}`);
  }
  const body = bodyToString(req.requestBody);
  if (body) {
    lines.push(`Content-Length: ${body.length}`);
    lines.push("");
    lines.push(body);
  }
  return lines.join("\r\n");
}
function toHarEntry(req) {
  if (!req || !req.url) return "{}";
  const entry = {
    startedDateTime: req.startTime ? new Date(req.startTime).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
    time: req.duration || 0,
    request: {
      method: (req.method || "GET").toUpperCase(),
      url: req.url,
      httpVersion: "HTTP/1.1",
      headers: headerEntries(req.requestHeaders).map(([name, value]) => ({ name, value: String(value) })),
      queryString: (() => {
        try {
          return Array.from(new URL(req.url).searchParams.entries()).map(([name, value]) => ({ name, value }));
        } catch {
          return [];
        }
      })(),
      bodySize: bodyToString(req.requestBody).length,
      postData: bodyToString(req.requestBody) ? {
        mimeType: req.requestHeaders && (req.requestHeaders["content-type"] || req.requestHeaders["Content-Type"]) || "application/octet-stream",
        text: bodyToString(req.requestBody)
      } : void 0
    },
    response: {
      status: req.status || 0,
      statusText: "",
      httpVersion: "HTTP/1.1",
      headers: headerEntries(req.responseHeaders).map(([name, value]) => ({ name, value: String(value) })),
      content: {
        size: req.size || 0,
        mimeType: req.responseHeaders && (req.responseHeaders["content-type"] || req.responseHeaders["Content-Type"]) || "",
        text: bodyToString(req.responseBody)
      },
      bodySize: req.size || 0
    },
    timings: {
      send: 0,
      wait: req.duration || 0,
      receive: 0
    }
  };
  return JSON.stringify(entry, null, 2);
}
function toQueryParams(req) {
  if (!req || !req.url) return "{}";
  try {
    const u = new URL(req.url);
    const params = {};
    for (const [k, v] of u.searchParams.entries()) params[k] = v;
    return Object.keys(params).length ? JSON.stringify(params, null, 2) : "(no query parameters)";
  } catch {
    return "(invalid URL)";
  }
}
function prettyBody(body) {
  if (body == null) return "";
  if (typeof body !== "string") {
    try {
      return JSON.stringify(body, null, 2);
    } catch {
      return String(body);
    }
  }
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return body;
  }
}
function headersToText(headers) {
  if (!headers || !Object.keys(headers).length) return "(no headers)";
  return Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join("\n");
}
function copyText$1(text) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard.writeText(text ?? "").then(() => true).catch(() => false);
}
const ICON_BTN = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  padding: 0,
  border: "none",
  borderRadius: "var(--radius-md)",
  background: "transparent",
  cursor: "pointer",
  transition: "all 120ms ease"
};
function ToolbarActions({ onClear, onReload, canReload }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-1)", flexShrink: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onClear,
        title: "Clear",
        style: { ...ICON_BTN, color: "var(--status-danger-text)" },
        onMouseEnter: (e) => e.currentTarget.style.background = "var(--status-danger-bg)",
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 15 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onReload,
        disabled: !canReload,
        title: "Reload app",
        style: {
          ...ICON_BTN,
          color: "var(--status-info-text)",
          opacity: canReload ? 1 : 0.4,
          cursor: canReload ? "pointer" : "default"
        },
        onMouseEnter: (e) => {
          if (canReload) e.currentTarget.style.background = "var(--status-info-bg)";
        },
        onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 15 })
      }
    )
  ] });
}
const LEVELS$1 = ["log", "info", "warn", "error", "debug"];
const CAP_HEIGHT = 200;
const LEVEL_CFG$1 = {
  log: { color: "var(--text-secondary)", bg: "transparent", tag: "LOG", tagBg: "var(--bg-card)", label: "Log", dot: "var(--text-tertiary)" },
  info: { color: "var(--status-info-text)", bg: "transparent", tag: "INF", tagBg: "var(--status-info-bg)", label: "Info", dot: "var(--status-info-text)" },
  warn: { color: "var(--status-warning-text)", bg: "var(--status-warning-bg)", tag: "WRN", tagBg: "var(--status-warning-bg)", label: "Warn", dot: "var(--status-warning-text)" },
  error: { color: "var(--status-danger-text)", bg: "var(--status-danger-bg)", tag: "ERR", tagBg: "var(--status-danger-bg)", label: "Error", dot: "var(--status-danger-text)" },
  debug: { color: "var(--accent-purple)", bg: "transparent", tag: "DBG", tagBg: "var(--bg-card)", label: "Debug", dot: "var(--accent-purple)" }
};
function formatTime$5(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}
function renderArg(arg) {
  if (arg == null) return String(arg);
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}
function renderArgPretty(arg) {
  if (arg == null) return String(arg);
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}
function shortCaller$1(caller) {
  if (!caller || !caller.file) return null;
  const parts = caller.file.replace(/\\/g, "/").split("/");
  const fileName = parts[parts.length - 1] || caller.file;
  return `${fileName}:${caller.line || 1}`;
}
const ConsoleTab = reactExports.forwardRef(function ConsoleTab2({ logs, openInEditor, symbolicateAndOpen, onClear, onReload, canReload }, ref) {
  const [activeLevels, setActiveLevels] = reactExports.useState(() => new Set(LEVELS$1));
  const [search, setSearch] = reactExports.useState("");
  const [menu, setMenu] = reactExports.useState(null);
  const searchRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }), []);
  const toggleLevel = (level) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (!activeLevels.has(log.level)) return false;
      if (q && !log.args.map(renderArg).join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [logs, activeLevels, search]);
  const openContextMenu = reactExports.useCallback((e, log) => {
    e.preventDefault();
    const msgText = log.args.map(renderArg).join(" ");
    const locations = parseLocations(msgText);
    setMenu({ x: e.clientX, y: e.clientY, log, msgText, locations });
  }, []);
  const closeMenu = reactExports.useCallback(() => setMenu(null), []);
  const copyAnd = reactExports.useCallback((text, label) => {
    copyText$1(text).then((ok) => {
      if (ok) zt.success(label);
    });
    setMenu(null);
  }, []);
  const handleOpenSource = reactExports.useCallback((log) => {
    const fn = symbolicateAndOpen || openInEditor;
    if (!fn) return;
    if (symbolicateAndOpen && log.stack) {
      symbolicateAndOpen(log.stack, log.caller).then((res) => {
        if (res && !res.ok) {
          if (res.reason === "not-found") {
            zt.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5e3 });
          } else if (res.reason !== "no-stack-or-caller") {
            zt.error("Could not resolve source location", { duration: 3e3 });
          }
        }
      });
    } else if (openInEditor && log.caller?.file) {
      openInEditor(log.caller.file, log.caller.line || 1, log.caller.col || 1).then((res) => {
        if (res && !res.ok && res.reason === "not-found") {
          zt.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5e3 });
        }
      });
    }
    setMenu(null);
  }, [symbolicateAndOpen, openInEditor]);
  const handleOpenFile = reactExports.useCallback((file, line, col) => {
    if (!openInEditor) return;
    openInEditor(file, line, col).then((res) => {
      if (res && !res.ok && res.reason === "not-found") {
        zt.error("VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH", { duration: 5e3 });
      }
    });
    setMenu(null);
  }, [openInEditor]);
  const menuCaller = menu?.log?.caller || null;
  const menuMsgLocations = menu?.locations?.filter((s) => s.type === "link") || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-3)",
      height: 38,
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      LEVELS$1.map((level) => {
        const active = activeLevels.has(level);
        const cfg = LEVEL_CFG$1[level];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          LevelChip,
          {
            active,
            color: cfg.color,
            dot: cfg.dot,
            label: cfg.label,
            onClick: () => toggleLevel(level),
            title: `${active ? "Hide" : "Show"} ${cfg.label.toLowerCase()} logs`
          },
          level
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 14, background: "var(--border-subtle)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: searchRef,
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Filter…",
          style: {
            ...INPUT_BASE,
            flex: 1,
            height: 30,
            fontSize: "var(--text-sm)",
            border: "none",
            background: "transparent",
            padding: 0
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: filtered.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarActions, { onClear, onReload, canReload })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: { flex: 1, minHeight: 0, overflow: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" },
        children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { size: 20, style: { opacity: 0.3 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "No console output" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Console logs will stream here" })
        ] }) : filtered.map((log, i) => {
          const cfg = LEVEL_CFG$1[log.level] || LEVEL_CFG$1.log;
          const textColor = cfg.color === "var(--text-secondary)" ? "var(--text-primary)" : cfg.color;
          const caller = log.caller;
          const callerLabel = shortCaller$1(caller);
          const isCapped = log.level === "error" || log.level === "warn";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            ConsoleRow,
            {
              log,
              cfg,
              textColor,
              callerLabel,
              isCapped,
              onContextMenu: (e) => openContextMenu(e, log),
              onCopy: () => copyAnd(log.args.map(renderArgPretty).join("\n"), "Copied"),
              onOpenSource: symbolicateAndOpen || openInEditor ? () => handleOpenSource(log) : null,
              caller,
              openInEditor
            },
            log.id || i
          );
        })
      }
    ),
    menu && /* @__PURE__ */ jsxRuntimeExports.jsxs(CursorMenu, { anchor: { x: menu.x, y: menu.y }, onClose: closeMenu, width: 300, children: [
      (menuCaller || menu?.log?.stack) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Open in VS Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenuItem,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
            label: menuCaller ? `${menuCaller.file}:${menuCaller.line}${menuCaller.col > 1 ? ":" + menuCaller.col : ""}` : "Resolve source & open",
            hint: "caller",
            onClick: () => handleOpenSource(menu.log)
          }
        )
      ] }),
      menuMsgLocations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        !menuCaller && !menu?.log?.stack && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Open in VS Code" }),
        menuMsgLocations.map((loc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenuItem,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
            label: `${loc.file}:${loc.line}${loc.col > 1 ? ":" + loc.col : ""}`,
            hint: "stack",
            onClick: () => handleOpenFile(loc.file, loc.line, loc.col)
          },
          i
        ))
      ] }),
      (menuCaller || menu?.log?.stack || menuMsgLocations.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Copy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
          label: "Copy message",
          hint: "⌘C",
          onClick: () => copyAnd(menu.msgText, "Copied message")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 11 }),
          label: "Copy message (pretty)",
          onClick: () => copyAnd(menu.log.args.map(renderArgPretty).join("\n"), "Copied (pretty)")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 11 }),
          label: "Copy with timestamp",
          onClick: () => copyAnd(
            `[${formatTime$5(menu.log.timestamp)}] [${(menu.log.level || "log").toUpperCase()}] ${menu.msgText}`,
            "Copied with timestamp"
          )
        }
      ),
      menuCaller && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 11 }),
          label: "Copy caller path",
          onClick: () => copyAnd(
            `${menuCaller.file}:${menuCaller.line}:${menuCaller.col}`,
            "Copied caller path"
          )
        }
      ),
      menuMsgLocations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Copy path" }),
        menuMsgLocations.map((loc, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenuItem,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 11 }),
            label: loc.value,
            onClick: () => copyAnd(loc.value, "Copied path")
          },
          i
        ))
      ] })
    ] })
  ] });
});
function ConsoleRow({ log, cfg, textColor, callerLabel, isCapped, onContextMenu, onCopy, onOpenSource, caller, openInEditor }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [hover, setHover] = reactExports.useState(false);
  const pretty = log.args.map(renderArgPretty).join("\n");
  const capped = isCapped && !expanded;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onContextMenu,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "relative",
        padding: "5px var(--space-3)",
        borderBottom: "1px solid var(--border-subtle)",
        background: cfg.bg,
        cursor: "default"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginBottom: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            width: 26,
            flexShrink: 0,
            textAlign: "center",
            fontSize: 9,
            fontWeight: "var(--font-weight-semibold)",
            color: cfg.color,
            letterSpacing: "0.02em"
          }, children: cfg.tag }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 80, flexShrink: 0, color: "var(--text-tertiary)", fontSize: 10 }, children: formatTime$5(log.timestamp) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 } }),
          callerLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CallerBadge,
            {
              caller,
              label: callerLabel,
              onClick: onOpenSource
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              marginLeft: 106,
              color: textColor,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              userSelect: "text",
              overflow: capped ? "hidden" : "visible",
              maxHeight: capped ? CAP_HEIGHT : "none"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClickablePath, { text: pretty, color: textColor, openInEditor })
          }
        ),
        capped && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setExpanded(true),
            style: {
              ...BTN_GHOST,
              marginLeft: 106,
              marginTop: 2,
              fontSize: 10,
              color: "var(--text-link)",
              gap: 2
            },
            children: "Show more"
          }
        ),
        hover && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onCopy,
            title: "Copy",
            style: {
              position: "absolute",
              top: 4,
              right: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 22,
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-panel)",
              color: "var(--text-tertiary)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 })
          }
        )
      ]
    }
  );
}
function CallerBadge({ caller, label, onClick }) {
  const [hover, setHover] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onClick: onClick ? (e) => {
        e.stopPropagation();
        onClick();
      } : void 0,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter") onClick();
      } : void 0,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      title: onClick ? `Open ${caller.file}:${caller.line}:${caller.col} in VS Code` : `${caller.file}:${caller.line}:${caller.col}`,
      style: {
        flexShrink: 0,
        fontSize: 10,
        fontFamily: "var(--font-mono)",
        color: hover ? "var(--text-link)" : "var(--text-tertiary)",
        textDecoration: hover ? "underline" : "none",
        cursor: onClick ? "pointer" : "default",
        padding: "1px 6px",
        borderRadius: "var(--radius-sm)",
        background: hover ? "var(--status-info-bg)" : "transparent",
        transition: "all 80ms ease",
        maxWidth: 160,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      children: label
    }
  );
}
function DeviceTabs({ devices, activeKey, onSelect, onClose }) {
  const [pendingClose, setPendingClose] = reactExports.useState(null);
  if (!devices.length) return null;
  const pendingDevice = devices.find((d) => d.key === pendingClose);
  const pendingLabel = pendingDevice?.name || pendingDevice?.key || "this device";
  const confirmClose = () => {
    if (pendingClose != null) onClose(pendingClose);
    setPendingClose(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      alignItems: "stretch",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-default)",
      background: "var(--bg-sidebar)",
      overflowX: "auto",
      overflowY: "hidden",
      height: 38
    }, children: devices.map((d) => {
      const active = d.key === activeKey;
      const label = d.name || d.key;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: () => onSelect(d.key),
          title: d.platform ? `${label} · ${d.platform}` : label,
          className: "device-tab-row",
          style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "0 var(--space-2) 0 var(--space-3)",
            height: "100%",
            cursor: "pointer",
            borderRight: "1px solid var(--border-subtle)",
            background: active ? "var(--bg-panel)" : "transparent",
            borderBottom: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
            flexShrink: 0,
            maxWidth: 280,
            minWidth: 120,
            transition: "background-color 120ms ease"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              width: 7,
              height: 7,
              borderRadius: "50%",
              flexShrink: 0,
              background: d.online ? "var(--status-success-text)" : "var(--text-tertiary)",
              boxShadow: d.online ? "0 0 4px var(--status-success-text)" : "none",
              transition: "background-color 300ms ease, box-shadow 300ms ease"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: "var(--text-sm)",
              fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
              fontFamily: "var(--font-ui)",
              color: active ? "var(--text-primary)" : "var(--text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: "var(--line-height-tight)",
              flex: 1,
              minWidth: 0
            }, children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: active ? "var(--text-secondary)" : "var(--text-tertiary)",
              background: "var(--bg-card)",
              padding: "1px 5px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              lineHeight: "var(--line-height-tight)",
              flexShrink: 0
            }, children: d.networkRequests.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  setPendingClose(d.key);
                },
                title: "Close",
                className: "device-tab-btn",
                style: {
                  border: "1px solid transparent",
                  background: "transparent",
                  color: "var(--text-tertiary)",
                  cursor: "pointer",
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-sm)",
                  flexShrink: 0,
                  opacity: 0,
                  transition: "opacity 100ms, border-color 100ms, background 100ms"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 })
              }
            )
          ]
        },
        d.key
      );
    }) }),
    pendingClose != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: () => setPendingClose(null),
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 1e3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--overlay-soft)",
          backdropFilter: "blur(2px)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            style: {
              width: 360,
              maxWidth: "90vw",
              background: "var(--bg-panel)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              padding: "var(--space-5)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "var(--status-warning-bg)",
                  color: "var(--status-warning-text)"
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 16 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--text-primary)"
                }, children: [
                  "Close ",
                  pendingLabel,
                  "?"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                fontSize: "var(--text-sm)",
                color: "var(--text-tertiary)",
                lineHeight: "var(--line-height-normal)"
              }, children: "All captured data for this device — network requests, WebSocket frames, console logs and server logs — will be lost. This cannot be undone." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "var(--space-2)", marginTop: "var(--space-1)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPendingClose(null), style: { ...BTN_SECONDARY, height: 30 }, children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: confirmClose, style: { ...BTN_DANGER, height: 30 }, children: "Close device" })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
const OVERSCAN = 8;
function useVirtualRows({ scrollRef, totalRows, rowHeight, stickyBottom = false }) {
  const [range, setRange] = reactExports.useState({ startIdx: 0, endIdx: 60 });
  const rafRef = reactExports.useRef(null);
  const stickRef = reactExports.useRef(stickyBottom);
  const prevTotalRef = reactExports.useRef(totalRows);
  const compute = reactExports.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const viewportHeight = el.clientHeight;
    if (viewportHeight === 0) return;
    const rawStart = Math.floor(scrollTop / rowHeight);
    const rawEnd = Math.ceil((scrollTop + viewportHeight) / rowHeight);
    const startIdx = Math.max(0, rawStart - OVERSCAN);
    const endIdx = Math.min(totalRows, rawEnd + OVERSCAN);
    setRange((prev) => {
      if (prev.startIdx === startIdx && prev.endIdx === endIdx) return prev;
      return { startIdx, endIdx };
    });
  }, [scrollRef, totalRows, rowHeight]);
  const onScroll = reactExports.useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      compute();
      if (stickyBottom) {
        const el = scrollRef.current;
        if (el) {
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < rowHeight * 2;
        }
      }
    });
  }, [compute, scrollRef, rowHeight, stickyBottom]);
  reactExports.useLayoutEffect(() => {
    compute();
  }, [totalRows, compute]);
  reactExports.useEffect(() => {
    if (stickyBottom && stickRef.current && totalRows > prevTotalRef.current) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
    prevTotalRef.current = totalRows;
  }, [totalRows, stickyBottom, scrollRef]);
  reactExports.useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollRef, compute]);
  reactExports.useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  const totalHeight = totalRows * rowHeight;
  const topSpacer = range.startIdx * rowHeight;
  const bottomSpacer = Math.max(0, (totalRows - range.endIdx) * rowHeight);
  const scrollToBottom = reactExports.useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      stickRef.current = true;
    }
  }, [scrollRef]);
  return {
    startIdx: range.startIdx,
    endIdx: range.endIdx,
    topSpacer,
    bottomSpacer,
    totalHeight,
    onScroll,
    scrollToBottom
  };
}
const LEVELS = ["info", "warn", "error"];
const ROW_HEIGHT$2 = 28;
const LEVEL_CFG = {
  info: { color: "var(--status-info-text)", tag: "INF", bg: "transparent", label: "Info", dot: "var(--status-info-text)" },
  warn: { color: "var(--status-warning-text)", tag: "WRN", bg: "var(--status-warning-bg)", label: "Warn", dot: "var(--status-warning-text)" },
  error: { color: "var(--status-danger-text)", tag: "ERR", bg: "var(--status-danger-bg)", label: "Error", dot: "var(--status-danger-text)" }
};
function formatTime$4(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}
const LogsTab = reactExports.forwardRef(function LogsTab2({ logs, onClear, onReload, canReload }, ref) {
  const [activeLevels, setActiveLevels] = reactExports.useState(() => new Set(LEVELS));
  const [search, setSearch] = reactExports.useState("");
  const scrollRef = reactExports.useRef(null);
  const searchRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }), []);
  const toggleLevel = (level) => {
    setActiveLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (!activeLevels.has(log.level || "info")) return false;
      if (q && !(log.message || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [logs, activeLevels, search]);
  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef,
    totalRows: filtered.length,
    rowHeight: ROW_HEIGHT$2,
    stickyBottom: true
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-3)",
      height: 38,
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      LEVELS.map((level) => {
        const active = activeLevels.has(level);
        const cfg = LEVEL_CFG[level];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          LevelChip,
          {
            active,
            color: cfg.color,
            dot: cfg.dot,
            label: cfg.label,
            onClick: () => toggleLevel(level),
            title: `${active ? "Hide" : "Show"} ${cfg.label.toLowerCase()} logs`
          },
          level
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 14, background: "var(--border-subtle)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: searchRef,
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Filter…",
          style: {
            ...INPUT_BASE,
            flex: 1,
            height: 30,
            fontSize: "var(--text-sm)",
            border: "none",
            background: "transparent",
            padding: 0
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: filtered.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarActions, { onClear, onReload, canReload })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollRef,
        onScroll,
        style: { flex: 1, minHeight: 0, overflow: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" },
        children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 20, style: { opacity: 0.3 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "No server logs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Server activity will appear here" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          topSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: topSpacer } }),
          filtered.slice(startIdx, endIdx).map((log, i) => {
            const cfg = LEVEL_CFG[log.level] || LEVEL_CFG.info;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "0 var(--space-3)",
              height: ROW_HEIGHT$2,
              borderBottom: "1px solid var(--border-subtle)",
              background: cfg.bg
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                width: 26,
                flexShrink: 0,
                textAlign: "center",
                fontSize: 9,
                fontWeight: "var(--font-weight-semibold)",
                color: cfg.color
              }, children: cfg.tag }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                width: 80,
                flexShrink: 0,
                color: "var(--text-tertiary)",
                fontSize: 10
              }, children: formatTime$4(log.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                flex: 1,
                minWidth: 0,
                color: "var(--text-secondary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                userSelect: "text"
              }, title: log.message, children: log.message })
            ] }, startIdx + i);
          }),
          bottomSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: bottomSpacer } })
        ] })
      }
    )
  ] });
});
function requestName(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const segs = u.pathname.split("/").filter(Boolean);
    for (let i = segs.length - 1; i >= 0; i--) {
      if (!/^\d+$/.test(segs[i])) return segs[i];
    }
    return segs[segs.length - 1] || u.pathname;
  } catch {
    const clean = url.split(/[?#]/)[0];
    const segs = clean.split("/").filter(Boolean);
    return segs[segs.length - 1] || url;
  }
}
function isRequestHidden(req, rules) {
  if (!rules || !rules.length) return false;
  const name = requestName(req.url);
  const url = req.url || "";
  for (const r of rules) {
    if (!r || !r.match) continue;
    if (r.hideRelated) {
      if (url.includes(r.match)) return true;
    } else if (name === r.match) {
      return true;
    }
  }
  return false;
}
const ROW_HEIGHT$1 = 34;
const COLS_LEAD = "60px minmax(0, 1fr) 64px 64px 64px";
const COL_WATERFALL = "minmax(150px, 1.15fr)";
const COL_ACTIONS = "28px";
function gridFor(showWaterfall) {
  return showWaterfall ? `${COLS_LEAD} ${COL_WATERFALL} ${COL_ACTIONS}` : `${COLS_LEAD} ${COL_ACTIONS}`;
}
const SORTS = {
  method: { get: (r) => (r.method || "GET").toUpperCase(), type: "text", first: "asc" },
  url: { get: (r) => shortUrl$1(r.url).toLowerCase(), type: "text", first: "asc" },
  // Pending sorts below every real status; a failed request (0) sits just above.
  status: { get: (r) => r.pending ? -1 : r.status ?? 0, type: "num", first: "desc" },
  size: { get: (r) => r.size ?? -1, type: "num", first: "desc" },
  duration: { get: (r) => r.duration ?? -1, type: "num", first: "desc" },
  // Chronological. `startTime` is when the request began; unlike `seq`, it
  // never changes when a pending request completes, so rows stay in place
  // instead of jumping to the top. `seq` is kept as the final tiebreaker.
  startTime: { get: (r) => r.startTime ?? 0, type: "num", first: "desc" }
};
const DEFAULT_SORT = { key: "startTime", dir: "desc" };
const WATERFALL_KEY = "rnspyDevtoolsWaterfall";
function readWaterfallPref() {
  try {
    return window.localStorage.getItem(WATERFALL_KEY) !== "0";
  } catch {
    return true;
  }
}
function compareBy(key, dir) {
  const spec = SORTS[key] || SORTS.startTime;
  const sign = dir === "asc" ? 1 : -1;
  return (a, b) => {
    const av = spec.get(a);
    const bv = spec.get(b);
    let d;
    if (spec.type === "text") d = String(av).localeCompare(String(bv));
    else d = (av ?? 0) - (bv ?? 0);
    if (d !== 0) return d * sign;
    return (b.startTime ?? 0) - (a.startTime ?? 0) || (b.seq ?? 0) - (a.seq ?? 0);
  };
}
function niceStep(span, targetTicks = 4) {
  if (!(span > 0)) return 1;
  const raw = span / targetTicks;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / pow;
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return mult * pow;
}
const PENDING_AXIS_CAP = 3e4;
function formatAxis(ms) {
  if (ms >= 1e3) return `${+(ms / 1e3).toFixed(ms % 1e3 === 0 ? 0 : 1)}s`;
  return `${Math.round(ms)}ms`;
}
function statusColor$1(status, pending) {
  if (pending) return "var(--text-tertiary)";
  if (status == null || status === 0) return "var(--status-danger-text)";
  if (status >= 500) return "var(--status-danger-text)";
  if (status >= 400) return "var(--status-warning-text)";
  if (status >= 300) return "var(--status-info-text)";
  if (status >= 200) return "var(--status-success-text)";
  return "var(--text-secondary)";
}
function statusRowBg(status, pending) {
  if (pending) return "transparent";
  if (status >= 500) return "var(--status-danger-bg)";
  if (status >= 400) return "var(--status-warning-bg)";
  return "transparent";
}
function methodColor(method) {
  const m = (method || "GET").toUpperCase();
  if (m === "GET") return "var(--method-get)";
  if (m === "POST") return "var(--method-post)";
  if (m === "PUT" || m === "PATCH") return "var(--method-put)";
  if (m === "DELETE") return "var(--method-delete)";
  return "var(--text-secondary)";
}
function formatSize$1(bytes) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} K`;
  return `${(bytes / 1048576).toFixed(1)} M`;
}
function formatDuration(ms) {
  if (ms == null) return "—";
  if (ms < 1e3) return `${Math.round(ms)}ms`;
  return `${(ms / 1e3).toFixed(1)}s`;
}
function shortUrl$1(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.pathname + u.search || url;
  } catch {
    return url;
  }
}
const NetworkTab = reactExports.forwardRef(function NetworkTab2({ requests, hiddenRules = [], onHideName, onClear, onReload, canReload }, ref) {
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [menu, setMenu] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [detailTab, setDetailTab] = reactExports.useState("headers");
  const [listPct, setListPct] = reactExports.useState(55);
  const [sort, setSort] = reactExports.useState(DEFAULT_SORT);
  const [showWaterfall, setShowWaterfall] = reactExports.useState(readWaterfallPref);
  const containerRef = reactExports.useRef(null);
  const draggingRef = reactExports.useRef(false);
  const scrollRef = reactExports.useRef(null);
  const searchRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }), []);
  const hasPending = reactExports.useMemo(() => requests.some((r) => r.pending), [requests]);
  const [, setTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!hasPending) return void 0;
    const t = setInterval(() => setTick((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [hasPending]);
  const toggleSort = reactExports.useCallback((key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: SORTS[key]?.first || "desc" };
      const natural = SORTS[key]?.first || "desc";
      const flipped = prev.dir === "asc" ? "desc" : "asc";
      if (prev.dir !== natural) return DEFAULT_SORT;
      return { key, dir: flipped };
    });
  }, []);
  const startResize = reactExports.useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    const move = (ev) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = (ev.clientX - rect.left) / rect.width * 100;
      setListPct(Math.min(78, Math.max(22, pct)));
    };
    const up = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, []);
  const visible = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (isRequestHidden(r, hiddenRules)) return false;
      if (q && !(r.url || "").toLowerCase().includes(q) && !(r.method || "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [requests, hiddenRules, search]);
  const sorted = reactExports.useMemo(
    () => visible.slice().sort(compareBy(sort.key, sort.dir)),
    [visible, sort.key, sort.dir]
  );
  const hiddenCount = requests.length - visible.length;
  const noMatches = requests.length > 0 && visible.length === 0;
  const axis = reactExports.useMemo(() => {
    if (!visible.length) return null;
    const now = Date.now();
    const starts = [];
    let max = -Infinity;
    let maxDur = 0;
    for (const r of visible) {
      const s = r.startTime;
      if (typeof s !== "number" || !Number.isFinite(s)) continue;
      const raw = r.pending ? Math.max(0, now - s) : r.duration || 0;
      const dur = r.pending ? Math.min(raw, PENDING_AXIS_CAP) : raw;
      const end = s + dur;
      starts.push(s);
      if (end > max) max = end;
      if (dur > maxDur) maxDur = dur;
    }
    if (!starts.length || !Number.isFinite(max)) return null;
    starts.sort((a, b) => a - b);
    const p10 = starts[Math.floor(starts.length * 0.1)];
    const span = Math.max(max - p10, maxDur, 50);
    const min = max - span;
    return { min, max, span, step: niceStep(span) };
  }, [visible]);
  const selected = reactExports.useMemo(
    () => sorted.find((r) => r.id === selectedId) || null,
    [sorted, selectedId]
  );
  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef,
    totalRows: sorted.length,
    rowHeight: ROW_HEIGHT$1
  });
  const openMenu = reactExports.useCallback((e, req) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, req });
  }, []);
  const closeMenu = reactExports.useCallback(() => setMenu(null), []);
  const copyAnd = reactExports.useCallback((text, label) => {
    copyText$1(text).then((ok) => {
      if (ok) zt.success(label);
    });
    setMenu(null);
  }, []);
  const DETAIL_TABS = [
    { key: "headers", label: "Headers" },
    { key: "request", label: "Payload" },
    { key: "response", label: "Response" },
    { key: "timing", label: "Timing" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, style: { flex: 1, display: "flex", minHeight: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: selected ? `0 0 ${listPct}%` : 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-panel)",
      borderRight: selected ? "1px solid var(--border-subtle)" : "none"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "0 var(--space-3)",
        height: 38,
        flexShrink: 0,
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-panel-alt)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: searchRef,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Filter…",
            style: {
              ...INPUT_BASE,
              flex: 1,
              height: 30,
              fontSize: "var(--text-sm)",
              border: "none",
              background: "transparent",
              padding: 0
            }
          }
        ),
        hiddenCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 10,
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 9 }),
          hiddenCount
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          LevelChip,
          {
            active: showWaterfall,
            color: "var(--accent-primary)",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 11 }),
            label: "Waterfall",
            onClick: () => setShowWaterfall((v) => {
              const next = !v;
              try {
                window.localStorage.setItem(WATERFALL_KEY, next ? "1" : "0");
              } catch {
              }
              return next;
            }),
            title: showWaterfall ? "Hide waterfall" : "Show waterfall"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarActions, { onClear, onReload, canReload })
      ] }),
      requests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownUp, { size: 20, style: { opacity: 0.3 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "No network requests yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "HTTP requests from this device will appear here" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            role: "row",
            style: {
              display: "grid",
              gridTemplateColumns: gridFor(showWaterfall),
              alignItems: "stretch",
              height: 24,
              flexShrink: 0,
              padding: "0 var(--space-3)",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--bg-panel-alt)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Method", sortKey: "method", sort, onSort: toggleSort }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "URL", sortKey: "url", sort, onSort: toggleSort }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Status", sortKey: "status", sort, onSort: toggleSort, align: "right" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Size", sortKey: "size", sort, onSort: toggleSort, align: "right" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Time", sortKey: "duration", sort, onSort: toggleSort, align: "right" }),
              showWaterfall && /* @__PURE__ */ jsxRuntimeExports.jsx(WaterfallRuler, { axis, sort, onSort: toggleSort }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ]
          }
        ),
        noMatches && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 20, style: { opacity: 0.3 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "No matching requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textAlign: "center" }, children: [
            requests.length,
            " captured",
            search.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · no match for “",
              search.trim(),
              "”"
            ] }) : null,
            hiddenCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · ",
              hiddenCount,
              " hidden by rules"
            ] }) : null
          ] }),
          search.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), style: { ...BTN_GHOST, marginTop: "var(--space-1)" }, children: "Clear filter" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: scrollRef,
            onScroll,
            style: { flex: 1, minHeight: 0, overflow: "auto", display: noMatches ? "none" : void 0 },
            children: [
              topSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: topSpacer } }),
              sorted.slice(startIdx, endIdx).map((r) => {
                const isSelected = r.id === selectedId;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: () => {
                      setSelectedId(r.id);
                    },
                    onContextMenu: (e) => openMenu(e, r),
                    style: {
                      display: "grid",
                      gridTemplateColumns: gridFor(showWaterfall),
                      alignItems: "center",
                      height: ROW_HEIGHT$1,
                      padding: "0 var(--space-3)",
                      cursor: "pointer",
                      background: isSelected ? "var(--bg-card-hover)" : statusRowBg(r.status, r.pending),
                      borderBottom: "1px solid var(--border-subtle)",
                      fontSize: "var(--text-sm)",
                      fontFamily: "var(--font-mono)",
                      lineHeight: "var(--line-height-tight)",
                      transition: "background-color 60ms ease"
                    },
                    onMouseEnter: (e) => {
                      if (!isSelected) e.currentTarget.style.background = "var(--bg-card-hover)";
                    },
                    onMouseLeave: (e) => {
                      if (!isSelected) e.currentTarget.style.background = statusRowBg(r.status, r.pending) || "";
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "var(--font-weight-semibold)", color: methodColor(r.method), fontSize: "var(--text-xs)" }, children: (r.method || "GET").toUpperCase() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        color: "var(--text-secondary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "var(--text-xs)",
                        paddingRight: "var(--space-2)"
                      }, title: r.url, children: shortUrl$1(r.url) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        textAlign: "right",
                        fontWeight: "var(--font-weight-semibold)",
                        fontSize: "var(--text-xs)",
                        color: statusColor$1(r.status, r.pending)
                      }, children: r.pending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bubble-dots", role: "status", "aria-label": "Pending", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
                      ] }) : r.status || "0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textAlign: "right", color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }, children: formatSize$1(r.size) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textAlign: "right", color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }, children: formatDuration(r.duration) }),
                      showWaterfall && /* @__PURE__ */ jsxRuntimeExports.jsx(WaterfallBar, { req: r, axis }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: (e) => {
                            e.stopPropagation();
                            openMenu(e, r);
                          },
                          style: {
                            border: "none",
                            background: "transparent",
                            color: "var(--text-tertiary)",
                            cursor: "pointer",
                            padding: 2,
                            display: "flex",
                            borderRadius: "var(--radius-sm)",
                            opacity: 0,
                            transition: "opacity 80ms"
                          },
                          className: "row-action-btn",
                          title: "Actions",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 12 })
                        }
                      ) })
                    ]
                  },
                  r.id
                );
              }),
              bottomSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: bottomSpacer } })
            ]
          }
        )
      ] })
    ] }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "panel-resizer",
          onMouseDown: startResize,
          style: { cursor: "col-resize", flexShrink: 0 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-panel-alt)",
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          alignItems: "center",
          padding: "var(--space-2) var(--space-3)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-sidebar)",
          gap: "var(--space-2)",
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "var(--line-height-tight)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: methodColor(selected.method) }, children: (selected.method || "GET").toUpperCase() }),
            " ",
            shortUrl$1(selected.url)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedId(null), style: {
            ...BTN_GHOST,
            padding: 2,
            height: 20
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-sidebar)",
          flexShrink: 0
        }, children: DETAIL_TABS.map((dt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setDetailTab(dt.key),
            style: {
              padding: "0 var(--space-3)",
              height: 26,
              border: "none",
              borderBottom: detailTab === dt.key ? "1px solid var(--accent-primary)" : "1px solid transparent",
              background: "transparent",
              color: detailTab === dt.key ? "var(--text-primary)" : "var(--text-tertiary)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "var(--font-ui)",
              cursor: "pointer"
            },
            children: dt.label
          },
          dt.key
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: "var(--space-3)" }, children: [
          detailTab === "headers" && /* @__PURE__ */ jsxRuntimeExports.jsx(HeadersDetail, { req: selected }),
          detailTab === "request" && /* @__PURE__ */ jsxRuntimeExports.jsx(BodyDetail, { body: selected.requestBody, label: "Request Body" }),
          detailTab === "response" && /* @__PURE__ */ jsxRuntimeExports.jsx(BodyDetail, { body: selected.responseBody, label: "Response Body" }),
          detailTab === "timing" && /* @__PURE__ */ jsxRuntimeExports.jsx(TimingDetail, { req: selected })
        ] })
      ] })
    ] }),
    menu && /* @__PURE__ */ jsxRuntimeExports.jsxs(CursorMenu, { anchor: { x: menu.x, y: menu.y }, onClose: closeMenu, width: 280, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 11 }),
          label: "Copy",
          hint: "⌘⇧C",
          onClick: () => {
            const r = menu.req;
            const parts = [
              `URL: ${r.url || ""}`,
              `Method: ${(r.method || "GET").toUpperCase()}`,
              `Status: ${r.pending ? "Pending" : r.status || "0"}`,
              r.requestBody ? `Payload: ${prettyBody(r.requestBody)}` : null,
              r.responseBody ? `Response: ${prettyBody(r.responseBody)}` : null
            ].filter(Boolean).join("\n");
            copyAnd(parts, "Copied request details");
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Copy as" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { size: 11 }),
          label: "Copy as cURL (bash)",
          hint: "⌘C",
          onClick: () => copyAnd(toCurl(menu.req), "Copied as cURL")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { size: 11 }),
          label: "Copy as cURL (PowerShell)",
          onClick: () => copyAnd(toCurlPowerShell(menu.req), "Copied as cURL (PS)")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { size: 11 }),
          label: "Copy as fetch()",
          onClick: () => copyAnd(toFetch(menu.req), "Copied as fetch()")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, { size: 11 }),
          label: "Copy as Node.js fetch",
          onClick: () => copyAnd(toNodeFetch(menu.req), "Copied as Node.js fetch")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Braces, { size: 11 }),
          label: "Copy as Axios",
          onClick: () => copyAnd(toAxios(menu.req), "Copied as Axios")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { size: 11 }),
          label: "Copy as HTTPie",
          onClick: () => copyAnd(toHttpie(menu.req), "Copied as HTTPie")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode, { size: 11 }),
          label: "Copy as raw HTTP",
          onClick: () => copyAnd(toRawHttp(menu.req), "Copied raw HTTP")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Copy value" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { size: 11 }),
          label: "Copy URL",
          onClick: () => copyAnd(menu.req.url || "", "Copied URL")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 11 }),
          label: "Copy query parameters",
          onClick: () => copyAnd(toQueryParams(menu.req), "Copied query params"),
          disabled: !menu.req.url || !menu.req.url.includes("?")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 11 }),
          label: "Copy request headers",
          onClick: () => copyAnd(headersToText(menu.req.requestHeaders), "Copied request headers")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 11 }),
          label: "Copy response headers",
          onClick: () => copyAnd(headersToText(menu.req.responseHeaders), "Copied response headers"),
          disabled: !menu.req.responseHeaders
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
          label: "Copy request body",
          onClick: () => copyAnd(prettyBody(menu.req.requestBody), "Copied request body"),
          disabled: !menu.req.requestBody
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
          label: "Copy response body",
          onClick: () => copyAnd(prettyBody(menu.req.responseBody), "Copied response body"),
          disabled: !menu.req.responseBody
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Export" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { size: 11 }),
          label: "Copy as HAR entry",
          onClick: () => copyAnd(toHarEntry(menu.req), "Copied HAR entry")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileJson, { size: 11 }),
          label: "Copy all headers as JSON",
          onClick: () => copyAnd(JSON.stringify({
            request: menu.req.requestHeaders || {},
            response: menu.req.responseHeaders || {}
          }, null, 2), "Copied headers JSON")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuDivider, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuLabel, { children: "Filter" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 11 }),
          label: `Hide "${requestName(menu.req.url)}"`,
          onClick: () => {
            onHideName?.({ match: requestName(menu.req.url), hideRelated: false });
            setMenu(null);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuItem,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 11 }),
          label: "Hide all related requests",
          onClick: () => {
            onHideName?.({ match: requestName(menu.req.url), hideRelated: true });
            setMenu(null);
          }
        }
      )
    ] })
  ] });
});
function SortHeader({ label, sortKey, sort, onSort, align = "left" }) {
  const active = sort.key === sortKey;
  const dir = active ? sort.dir : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSort(sortKey),
      title: `Sort by ${label.toLowerCase()}`,
      "aria-sort": active ? dir === "asc" ? "ascending" : "descending" : "none",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        height: "100%",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        ...SECTION_LABEL,
        fontSize: 10,
        color: active ? "var(--text-secondary)" : "var(--text-tertiary)",
        overflow: "hidden"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.color = "var(--text-primary)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.color = active ? "var(--text-secondary)" : "var(--text-tertiary)";
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChevronDown,
          {
            size: 9,
            style: {
              flexShrink: 0,
              opacity: active ? 1 : 0,
              color: "var(--accent-primary)",
              transform: dir === "asc" ? "rotate(180deg)" : "none",
              transition: "transform 120ms ease, opacity 120ms ease"
            },
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
function WaterfallRuler({ axis, sort, onSort }) {
  const active = sort.key === "startTime";
  const ticks = [];
  if (axis && axis.step > 0) {
    for (let t = 0; t <= axis.span + 0.5; t += axis.step) {
      const pct = t / axis.span * 100;
      if (pct > 100) break;
      ticks.push({ t, pct });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSort("startTime"),
      title: "Waterfall — click to sort chronologically",
      "aria-sort": active ? sort.dir === "asc" ? "ascending" : "descending" : "none",
      style: {
        position: "relative",
        height: "100%",
        marginLeft: "var(--space-2)",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden"
      },
      children: [
        ticks.map(({ t, pct }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            position: "absolute",
            left: `${pct}%`,
            top: 0,
            bottom: 0,
            width: 1,
            background: "var(--border-subtle)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
            position: "absolute",
            left: pct > 90 ? void 0 : `${pct}%`,
            right: pct > 90 ? 0 : void 0,
            top: "50%",
            transform: "translateY(-50%)",
            paddingLeft: pct > 90 ? 0 : 3,
            ...SECTION_LABEL,
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: active ? "var(--text-secondary)" : "var(--text-tertiary)",
            whiteSpace: "nowrap"
          }, children: i === 0 ? "0" : formatAxis(t) })
        ] }, t)),
        !ticks.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...SECTION_LABEL, fontSize: 10, color: "var(--text-tertiary)" }, children: "Waterfall" })
      ]
    }
  );
}
function WaterfallBar({ req, axis }) {
  if (!axis || typeof req.startTime !== "number") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {});
  }
  const now = Date.now();
  const dur = req.pending ? Math.max(0, now - req.startTime) : req.duration || 0;
  const offsetPct = (req.startTime - axis.min) / axis.span * 100;
  const widthPct = dur / axis.span * 100;
  const clipped = offsetPct < 0;
  const clampedLeft = Math.max(0, Math.min(99.5, offsetPct));
  const clampedWidth = Math.max(0.6, Math.min(100 - clampedLeft, widthPct));
  const ttfb = typeof req.ttfb === "number" && req.ttfb >= 0 && dur > 0 ? Math.min(req.ttfb, dur) : null;
  const waitFrac = ttfb != null ? ttfb / dur : null;
  const barColor = statusColor$1(req.status, req.pending);
  const title = [
    clipped ? "Started before the visible window" : `Started +${formatAxis(Math.max(0, req.startTime - axis.min))}`,
    ttfb != null ? `Wait (TTFB) ${formatDuration(ttfb)}` : null,
    ttfb != null ? `Download ${formatDuration(dur - ttfb)}` : null,
    `Total ${req.pending ? formatDuration(dur) + " (in flight)" : formatDuration(dur)}`
  ].filter(Boolean).join("\n");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      title,
      style: {
        position: "relative",
        height: "100%",
        marginLeft: "var(--space-2)",
        display: "block",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          style: {
            position: "absolute",
            left: `${clampedLeft}%`,
            width: `${clampedWidth}%`,
            top: "50%",
            transform: "translateY(-50%)",
            height: 8,
            // Square off the left edge when the bar is clipped, so it reads as
            // "continues off-screen" rather than a normal rounded start.
            borderRadius: clipped ? "0 2px 2px 0" : 2,
            display: "flex",
            overflow: "hidden",
            background: "var(--bg-card)",
            borderLeft: clipped ? "2px dotted var(--text-tertiary)" : void 0,
            // Only animate width for in-flight bars; animating every row on a
            // re-sort would look like the data was moving on its own.
            transition: req.pending ? "width 240ms linear" : "none"
          },
          children: waitFrac != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              width: `${waitFrac * 100}%`,
              background: "var(--bg-card-hover)",
              borderLeft: `2px solid ${barColor}`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, background: barColor, opacity: 0.85 } })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: req.pending ? "animate-pulse" : void 0,
              style: { flex: 1, background: barColor, opacity: req.pending ? 0.5 : 0.85 }
            }
          )
        }
      )
    }
  );
}
function HeadersDetail({ req }) {
  const generalText = [
    `URL: ${req.url}`,
    `Method: ${(req.method || "GET").toUpperCase()}`,
    `Status: ${req.pending ? "Pending" : req.status || "Failed"}`,
    `Size: ${formatSize$1(req.size)}`,
    `Duration: ${formatDuration(req.duration)}`
  ].join("\n");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailSection, { title: "General", defaultOpen: true, copyValue: generalText, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "URL", value: req.url, mono: true, copyable: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Method", value: (req.method || "GET").toUpperCase(), valueColor: methodColor(req.method), copyable: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Status", value: req.pending ? "Pending…" : String(req.status || "Failed"), valueColor: statusColor$1(req.status, req.pending), copyable: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Size", value: formatSize$1(req.size), copyable: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Duration", value: formatDuration(req.duration), copyable: true })
    ] }),
    req.requestHeaders && Object.keys(req.requestHeaders).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSection, { title: "Request Headers", defaultOpen: true, copyValue: headersToText(req.requestHeaders), children: Object.entries(req.requestHeaders).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: k, value: String(v), mono: true, copyable: true }, k)) }),
    req.responseHeaders && Object.keys(req.responseHeaders).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSection, { title: "Response Headers", defaultOpen: true, copyValue: headersToText(req.responseHeaders), children: Object.entries(req.responseHeaders).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: k, value: String(v), mono: true, copyable: true }, k)) })
  ] });
}
function DetailSection({ title, defaultOpen = true, copyValue, children }) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setOpen(!open),
          style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            flex: 1,
            padding: "var(--space-1) 0",
            border: "none",
            background: "transparent",
            color: "var(--text-primary)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--font-weight-semibold)",
            fontFamily: "var(--font-ui)",
            cursor: "pointer",
            lineHeight: "var(--line-height-tight)"
          },
          children: [
            open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 10 }),
            title
          ]
        }
      ),
      copyValue && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => copyText$1(copyValue).then((ok) => {
            if (ok) zt.success(`Copied ${title.toLowerCase()}`);
          }),
          title: `Copy ${title.toLowerCase()}`,
          style: {
            border: "none",
            background: "transparent",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            borderRadius: "var(--radius-sm)",
            opacity: 0.6,
            transition: "opacity 100ms"
          },
          onMouseEnter: (e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.color = "var(--text-primary)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.opacity = 0.6;
            e.currentTarget.style.color = "var(--text-tertiary)";
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderBottom: "1px solid var(--border-subtle)" } }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--space-1) 0 0 var(--space-4)" }, children })
  ] });
}
function KV({ label, value, valueColor, mono, copyable }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv-row", style: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    padding: "2px 0",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--line-height-tight)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      width: 140,
      flexShrink: 0,
      color: "var(--text-tertiary)",
      fontWeight: "var(--font-weight-medium)",
      fontFamily: "var(--font-ui)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      flex: 1,
      minWidth: 0,
      color: valueColor || "var(--text-secondary)",
      fontFamily: mono ? "var(--font-mono)" : "var(--font-ui)",
      wordBreak: "break-all",
      userSelect: "text"
    }, children: value }),
    copyable && value && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "kv-copy-btn",
        onClick: () => copyText$1(String(value)).then((ok) => {
          if (ok) zt.success("Copied");
        }),
        title: "Copy value",
        style: {
          border: "none",
          background: "transparent",
          color: "var(--text-tertiary)",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          borderRadius: "var(--radius-sm)",
          flexShrink: 0,
          opacity: 0,
          transition: "opacity 100ms"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 10 })
      }
    )
  ] });
}
const JSON_TREE_INDENT = 14;
function valueType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}
function JsonPrimitive({ value, type }) {
  if (type === "string") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--json-string)" }, children: JSON.stringify(value) });
  if (type === "number") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--json-number)" }, children: String(value) });
  if (type === "boolean") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--json-keyword)" }, children: String(value) });
  if (type === "null") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--json-keyword)" }, children: "null" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String(value) });
}
function JsonArrow({ open, onClick, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      "aria-label": label,
      style: {
        border: "none",
        background: "transparent",
        padding: "0 3px 0 0",
        margin: 0,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        lineHeight: 1
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        width: 0,
        height: 0,
        borderLeft: "4px solid var(--text-tertiary)",
        borderTop: "3.5px solid transparent",
        borderBottom: "3.5px solid transparent",
        transform: open ? "rotate(90deg)" : "none",
        transition: "transform 100ms ease"
      } })
    }
  );
}
function JsonPreviewValue({ value }) {
  const type = valueType(value);
  if (type === "object") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)" }, children: "{…}" });
  if (type === "array") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)" }, children: "[…]" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(JsonPrimitive, { value, type });
}
const PREVIEW_LIMIT = 5;
function JsonPreview({ value, type }) {
  const muted = { color: "var(--text-tertiary)" };
  if (type === "array") {
    const items = value.slice(0, PREVIEW_LIMIT);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: muted, children: [
      "[",
      items.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        i > 0 && ", ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(JsonPreviewValue, { value: v })
      ] }, i)),
      value.length > PREVIEW_LIMIT && ", …",
      "]"
    ] });
  }
  const entries = Object.entries(value);
  const shown = entries.slice(0, PREVIEW_LIMIT);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: muted, children: [
    "{",
    shown.map(([k, v], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      i > 0 && ", ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--json-key)" }, children: k }),
      ": ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(JsonPreviewValue, { value: v })
    ] }, k)),
    entries.length > PREVIEW_LIMIT && ", …",
    "}"
  ] });
}
function JsonNode({ name, value, level }) {
  const [isOpen, setIsOpen] = reactExports.useState(true);
  const type = valueType(value);
  if (type === "object" || type === "array") {
    const entries = type === "object" ? Object.entries(value) : value.map((v, i) => [i, v]);
    const isEmpty = entries.length === 0;
    const openBracket = type === "object" ? "{" : "[";
    const closeBracket = type === "object" ? "}" : "]";
    const keyPrefix = name != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--json-key)" }, children: [
      name,
      ": "
    ] }) : null;
    if (isEmpty) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: level * JSON_TREE_INDENT }, children: [
        keyPrefix,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--text-tertiary)" }, children: [
          openBracket,
          closeBracket
        ] })
      ] });
    }
    if (!isOpen) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: level * JSON_TREE_INDENT }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(JsonArrow, { open: false, onClick: () => setIsOpen(true), label: "Expand" }),
        keyPrefix,
        /* @__PURE__ */ jsxRuntimeExports.jsx(JsonPreview, { value, type })
      ] });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: level * JSON_TREE_INDENT }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(JsonArrow, { open: true, onClick: () => setIsOpen(false), label: "Collapse" }),
        keyPrefix,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)" }, children: openBracket })
      ] }),
      entries.map(([key, val]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        JsonNode,
        {
          name: type === "object" ? key : null,
          value: val,
          level: level + 1
        },
        String(key)
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: level * JSON_TREE_INDENT }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)" }, children: closeBracket }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: level * JSON_TREE_INDENT }, children: [
    name != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--json-key)" }, children: [
      name,
      ": "
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(JsonPrimitive, { value, type })
  ] });
}
function JsonTree({ data }) {
  const parsed = reactExports.useMemo(() => {
    if (data == null) return null;
    if (typeof data === "object") return data;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, [data]);
  if (parsed === null) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--line-height-normal)",
    color: "var(--text-secondary)",
    userSelect: "text",
    wordBreak: "break-all"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(JsonNode, { value: parsed, level: 0 }) });
}
function BodyDetail({ body, label }) {
  const text = prettyBody(body);
  if (!text) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "var(--space-4)",
      textAlign: "center",
      color: "var(--text-tertiary)",
      fontSize: "var(--text-xs)"
    }, children: [
      "No ",
      label.toLowerCase()
    ] });
  }
  const isJson = reactExports.useMemo(() => {
    if (body == null) return false;
    if (typeof body === "object") return true;
    try {
      JSON.parse(body);
      return true;
    } catch {
      return false;
    }
  }, [body]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => copyText$1(text).then((ok) => {
          if (ok) zt.success(`Copied ${label.toLowerCase()}`);
        }),
        title: `Copy ${label.toLowerCase()}`,
        style: {
          position: "absolute",
          top: "var(--space-2)",
          right: "var(--space-2)",
          border: "none",
          background: "var(--bg-sidebar)",
          color: "var(--text-tertiary)",
          cursor: "pointer",
          padding: 4,
          display: "flex",
          borderRadius: "var(--radius-sm)",
          opacity: 0.7,
          transition: "opacity 100ms"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = 1;
          e.currentTarget.style.color = "var(--text-primary)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = 0.7;
          e.currentTarget.style.color = "var(--text-tertiary)";
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 12 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      lineHeight: "var(--line-height-normal)",
      fontFamily: "var(--font-mono)",
      color: "var(--text-secondary)",
      userSelect: "text",
      background: "var(--bg-code-block)",
      padding: "var(--space-3)",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-subtle)"
    }, children: isJson ? /* @__PURE__ */ jsxRuntimeExports.jsx(JsonTree, { data: body }) : /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }, children: text }) })
  ] });
}
function TimingDetail({ req }) {
  const isPending = !!req.pending;
  const duration = isPending ? Math.max(0, Date.now() - (req.startTime || Date.now())) : req.duration || 0;
  const ttfb = typeof req.ttfb === "number" && req.ttfb >= 0 && duration > 0 ? Math.min(req.ttfb, duration) : null;
  const download = ttfb != null ? Math.max(0, duration - ttfb) : null;
  const phases = ttfb != null ? [
    { key: "wait", label: "Waiting (TTFB)", ms: ttfb, color: "var(--status-warning-text)" },
    { key: "download", label: "Content download", ms: download, color: "var(--accent-primary)" }
  ] : [{ key: "total", label: "Total", ms: duration, color: "var(--accent-primary)" }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-3)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DetailSection, { title: "Timing", defaultOpen: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        KV,
        {
          label: "Started",
          value: req.startTime ? new Date(req.startTime).toISOString() : "—",
          mono: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Duration", value: isPending ? `${formatDuration(duration)} (in flight)` : formatDuration(duration) }),
      ttfb != null && /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Waiting (TTFB)", value: formatDuration(ttfb) }),
      download != null && /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Content download", value: formatDuration(download) }),
      req.size != null && /* @__PURE__ */ jsxRuntimeExports.jsx(KV, { label: "Transferred", value: formatSize$1(req.size) })
    ] }),
    duration > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          role: "img",
          "aria-label": phases.map((p) => `${p.label} ${formatDuration(p.ms)}`).join(", "),
          style: {
            display: "flex",
            height: 8,
            borderRadius: 2,
            background: "var(--bg-card)",
            overflow: "hidden",
            border: "1px solid var(--border-subtle)"
          },
          children: phases.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              title: `${p.label} — ${formatDuration(p.ms)}`,
              style: {
                width: `${p.ms / duration * 100}%`,
                background: p.color,
                opacity: p.key === "wait" ? 0.45 : 0.85,
                transition: "width 180ms ease"
              }
            },
            p.key
          ))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "var(--space-1)",
        fontSize: 10,
        color: "var(--text-tertiary)",
        fontFamily: "var(--font-mono)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0ms" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDuration(duration) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginTop: "var(--space-2)"
      }, children: phases.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-ui)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          width: 8,
          height: 8,
          borderRadius: 2,
          flexShrink: 0,
          background: p.color,
          opacity: p.key === "wait" ? 0.45 : 0.85
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, color: "var(--text-secondary)" }, children: p.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: formatDuration(p.ms) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
          width: 40,
          textAlign: "right",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)"
        }, children: [
          Math.round(p.ms / duration * 100),
          "%"
        ] })
      ] }, p.key)) }),
      ttfb == null && !isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        marginTop: "var(--space-2)",
        fontSize: "var(--text-xs)",
        color: "var(--text-tertiary)",
        fontFamily: "var(--font-ui)",
        lineHeight: "var(--line-height-normal)"
      }, children: "Phase breakdown needs the updated SDK snippet — reconnect the app to capture time-to-first-byte." })
    ] })
  ] });
}
const KEY_COL = 260;
function tryParseJson(str) {
  if (typeof str !== "string") return { ok: false };
  const t = str.trim();
  if (!t || t[0] !== "{" && t[0] !== "[") return { ok: false };
  try {
    return { ok: true, value: JSON.parse(t) };
  } catch {
    return { ok: false };
  }
}
function prettyValue(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  const parsed = tryParseJson(String(value));
  if (parsed.ok) {
    try {
      return JSON.stringify(parsed.value, null, 2);
    } catch {
    }
  }
  return String(value);
}
function onelinePreview(value) {
  if (value == null) return "null";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  const parsed = tryParseJson(String(value));
  if (parsed.ok) {
    try {
      return JSON.stringify(parsed.value);
    } catch {
    }
  }
  return String(value);
}
function typeBadgeColor(type) {
  if (type === "number") return "var(--status-info-text)";
  if (type === "boolean") return "var(--accent-purple)";
  return "var(--text-tertiary)";
}
function formatTime$3(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false });
}
function StorageTab({
  storage,
  online,
  onRefresh,
  onSetValue,
  onRemoveKey,
  onOpenInstance,
  autoRefresh,
  onToggleAutoRefresh
}) {
  const backends = reactExports.useMemo(
    () => storage && Array.isArray(storage.backends) ? storage.backends : [],
    [storage]
  );
  const diag = storage?.diag || null;
  const [activeBackend, setActiveBackend] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [instanceId, setInstanceId] = reactExports.useState("");
  const requestedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (online && !requestedRef.current && backends.length === 0) {
      requestedRef.current = true;
      onRefresh?.();
    }
  }, [online, backends.length, onRefresh]);
  const backendKeys = backends.map((b) => `${b.backend}:${b.instanceId}`);
  const backendKeySig = backendKeys.join("|");
  reactExports.useEffect(() => {
    if (!backendKeys.length) {
      setActiveBackend(null);
      return;
    }
    if (!activeBackend || !backendKeys.includes(activeBackend)) {
      setActiveBackend(backendKeys[0]);
    }
  }, [backendKeySig]);
  const current = reactExports.useMemo(
    () => backends.find((b) => `${b.backend}:${b.instanceId}` === activeBackend) || null,
    [backends, activeBackend]
  );
  const entries = reactExports.useMemo(() => {
    const all = (current?.entries || []).slice();
    all.sort((a, b) => String(a.key).localeCompare(String(b.key)));
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter((e) => String(e.key).toLowerCase().includes(q) || onelinePreview(e.value).toLowerCase().includes(q));
  }, [current, search]);
  const startEdit = reactExports.useCallback((entry) => {
    setEditing({
      storageKey: entry.key,
      value: prettyValue(entry.value),
      type: entry.type || "string",
      isNew: false
    });
  }, []);
  const startAdd = reactExports.useCallback(() => {
    setEditing({ storageKey: "", value: "", type: "string", isNew: true });
  }, []);
  const cancelEdit = reactExports.useCallback(() => setEditing(null), []);
  const canEdit = online && !!current;
  const saveEdit = reactExports.useCallback(() => {
    if (!current || !editing) return;
    const storageKey = editing.storageKey.trim();
    if (!storageKey) {
      zt.error("Key is required");
      return;
    }
    let value = editing.value;
    let type = editing.type;
    if (current.backend === "mmkv") {
      if (type === "number" && value.trim() !== "" && Number.isNaN(Number(value))) {
        zt.error("Value is not a valid number");
        return;
      }
    } else {
      const looksJson = value.trim() && (value.trim()[0] === "{" || value.trim()[0] === "[");
      if (looksJson) {
        try {
          JSON.parse(value);
        } catch {
          zt.error("Invalid JSON");
          return;
        }
      }
      type = "string";
    }
    onSetValue?.({
      backend: current.backend,
      instanceId: current.instanceId,
      storageKey,
      value,
      type
    });
    zt.success(editing.isNew ? `Added "${storageKey}"` : `Updated "${storageKey}"`);
    setEditing(null);
  }, [current, editing, onSetValue]);
  const removeEntry = reactExports.useCallback((entry) => {
    if (!current) return;
    onRemoveKey?.({
      backend: current.backend,
      instanceId: current.instanceId,
      storageKey: entry.key
    });
    zt.success(`Removed "${entry.key}"`);
  }, [current, onRemoveKey]);
  if (!online && backends.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, style: { opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "Device offline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Storage can only be read while the app is connected." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-3)",
      height: 38,
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      backends.map((b) => {
        const key = `${b.backend}:${b.instanceId}`;
        const active = key === activeBackend;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          LevelChip,
          {
            active,
            color: "var(--accent-primary)",
            label: b.label,
            badge: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, fontFamily: "var(--font-mono)", opacity: 0.75 }, children: b.entries?.length || 0 }),
            onClick: () => setActiveBackend(key),
            title: b.label
          },
          key
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 200 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 12, style: {
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-tertiary)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Filter keys/values",
            style: { ...INPUT_BASE, width: "100%", paddingLeft: 26, fontSize: "var(--text-xs)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LevelChip,
        {
          active: autoRefresh,
          color: "var(--status-success-text)",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
          label: "Auto",
          onClick: onToggleAutoRefresh,
          title: autoRefresh ? "Auto-refresh on (every 2s)" : "Auto-refresh off"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRefresh,
          disabled: !online,
          title: "Refresh now",
          style: { ...BTN_GHOST, opacity: online ? 1 : 0.4, cursor: online ? "pointer" : "default" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: startAdd,
          disabled: !canEdit,
          title: "Add key",
          style: { ...BTN_SECONDARY, height: 26, opacity: canEdit ? 1 : 0.4, cursor: canEdit ? "pointer" : "default" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "4px var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-sidebar)",
      ...SECTION_LABEL,
      fontSize: 10
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: current ? current.label : "No storage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.6 }, children: [
        "· ",
        entries.length,
        " key",
        entries.length === 1 ? "" : "s"
      ] }),
      storage?.updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.6 }, children: [
        "· updated ",
        formatTime$3(storage.updatedAt)
      ] }),
      storage?.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--status-danger-text)" }, children: [
        "· ",
        storage.error
      ] })
    ] }),
    diag && (diag.mmkvResolved === false || diag.notes && diag.notes.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "6px var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--status-warning-border)",
      background: "var(--status-warning-bg)",
      fontSize: "var(--text-xs)",
      fontFamily: "var(--font-mono)",
      color: "var(--status-warning-text)"
    }, children: [
      diag.mmkvResolved === false && (diag.mmkvError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "MMKV not usable: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: diag.mmkvError })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "MMKV module not found — ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "react-native-mmkv" }),
        " could not be required in the app."
      ] })),
      (diag.notes || []).map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.9 }, children: [
        "• ",
        n
      ] }, i))
    ] }),
    onOpenInstance && diag?.mmkvResolved !== false && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "5px var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...SECTION_LABEL, fontSize: 10 }, children: "MMKV instance id" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: instanceId,
          onChange: (e) => setInstanceId(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && instanceId.trim() && online) {
              onOpenInstance(instanceId.trim());
              setInstanceId("");
            }
          },
          placeholder: "e.g. user-storage",
          disabled: !online,
          style: { ...INPUT_BASE, width: 220, height: 24, fontSize: "var(--text-xs)" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            if (instanceId.trim()) {
              onOpenInstance(instanceId.trim());
              setInstanceId("");
            }
          },
          disabled: !online || !instanceId.trim(),
          title: "Open a named MMKV instance created with new MMKV({ id })",
          style: {
            ...BTN_SECONDARY,
            height: 24,
            opacity: online && instanceId.trim() ? 1 : 0.4,
            cursor: online && instanceId.trim() ? "pointer" : "default"
          },
          children: "Open"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Data in a named store? Enter its id to inspect it." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, style: { opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", color: "var(--text-secondary)" }, children: current ? "No keys in this store" : "No storage backends detected" }),
      !current && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)", maxWidth: 380, textAlign: "center" }, children: "Install @react-native-async-storage/async-storage or react-native-mmkv in the target app, then reload." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("table", { style: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: entries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        style: { borderBottom: "1px solid var(--border-subtle)" },
        onDoubleClick: () => canEdit && startEdit(entry),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: {
            width: KEY_COL,
            padding: "6px var(--space-3)",
            verticalAlign: "top",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--text-primary)",
            wordBreak: "break-all"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: 8,
              fontWeight: "var(--font-weight-semibold)",
              color: typeBadgeColor(entry.type),
              textTransform: "uppercase",
              flexShrink: 0
            }, children: (entry.type || "string").slice(0, 3) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entry.key })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              style: {
                padding: "6px var(--space-3)",
                verticalAlign: "top",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                wordBreak: "break-all",
                cursor: canEdit ? "text" : "default"
              },
              onClick: () => canEdit && startEdit(entry),
              title: canEdit ? "Click to edit" : "",
              children: onelinePreview(entry.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { width: 34, padding: "4px", verticalAlign: "top", textAlign: "right" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => removeEntry(entry),
              disabled: !canEdit,
              title: "Delete key",
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                color: "var(--status-danger-text)",
                cursor: canEdit ? "pointer" : "default",
                opacity: canEdit ? 0.7 : 0.25
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
            }
          ) })
        ]
      },
      entry.key
    )) }) }) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditorModal,
      {
        editing,
        setEditing,
        backend: current?.backend,
        onCancel: cancelEdit,
        onSave: saveEdit
      }
    )
  ] });
}
function EditorModal({ editing, setEditing, backend, onCancel, onSave }) {
  const isMmkv = backend === "mmkv";
  const jsonParsed = tryParseJson(editing.value);
  const jsonInvalid = !isMmkv && editing.value.trim() && (editing.value.trim()[0] === "{" || editing.value.trim()[0] === "[") && !jsonParsed.ok;
  const formatJson = () => {
    if (!jsonParsed.ok) return;
    setEditing((e) => ({ ...e, value: JSON.stringify(jsonParsed.value, null, 2) }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onClick: onCancel,
      style: {
        position: "absolute",
        inset: 0,
        background: "var(--overlay-soft)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            width: "min(680px, 90%)",
            maxHeight: "80%",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-4)",
              borderBottom: "1px solid var(--border-subtle)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 14, color: "var(--accent-primary)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-primary)" }, children: editing.isNew ? "Add key" : "Edit value" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, style: { ...BTN_GHOST, padding: 4 }, title: "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "var(--space-4)", overflow: "auto", display: "flex", flexDirection: "column", gap: "var(--space-3)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { ...SECTION_LABEL, fontSize: 10 }, children: "Key" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: editing.storageKey,
                    onChange: (e) => setEditing((s) => ({ ...s, storageKey: e.target.value })),
                    disabled: !editing.isNew,
                    placeholder: "storage.key",
                    autoFocus: editing.isNew,
                    style: { ...INPUT_BASE, width: "100%", opacity: editing.isNew ? 1 : 0.6 }
                  }
                )
              ] }),
              isMmkv && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { ...SECTION_LABEL, fontSize: 10 }, children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "var(--space-1)" }, children: ["string", "number", "boolean"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setEditing((s) => ({ ...s, type: t })),
                    style: {
                      padding: "4px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: editing.type === t ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                      background: editing.type === t ? "var(--status-success-bg)" : "transparent",
                      color: editing.type === t ? "var(--text-primary)" : "var(--text-tertiary)",
                      fontSize: "var(--text-xs)",
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer"
                    },
                    children: t
                  },
                  t
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { ...SECTION_LABEL, fontSize: 10 }, children: "Value" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
                  jsonParsed.ok && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: formatJson, style: { ...BTN_GHOST }, title: "Pretty-print JSON", children: "Format JSON" }),
                  jsonInvalid && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--text-xs)", color: "var(--status-danger-text)" }, children: "Invalid JSON" })
                ] }),
                isMmkv && editing.type === "boolean" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: "var(--space-1)" }, children: ["true", "false"].map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setEditing((s) => ({ ...s, value: v })),
                    style: {
                      padding: "6px 16px",
                      borderRadius: "var(--radius-sm)",
                      border: editing.value === v ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                      background: editing.value === v ? "var(--status-success-bg)" : "transparent",
                      color: editing.value === v ? "var(--text-primary)" : "var(--text-tertiary)",
                      fontSize: "var(--text-sm)",
                      fontFamily: "var(--font-mono)",
                      cursor: "pointer"
                    },
                    children: v
                  },
                  v
                )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: editing.value,
                    onChange: (e) => setEditing((s) => ({ ...s, value: e.target.value })),
                    spellCheck: false,
                    rows: 10,
                    style: {
                      width: "100%",
                      resize: "vertical",
                      minHeight: 120,
                      padding: "var(--space-2)",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${jsonInvalid ? "var(--status-danger-border)" : "var(--border-default)"}`,
                      background: "var(--bg-input)",
                      color: "var(--text-primary)",
                      fontSize: "var(--text-sm)",
                      fontFamily: "var(--font-mono)",
                      lineHeight: "var(--line-height-normal)",
                      outline: "none"
                    }
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-4)",
              borderTop: "1px solid var(--border-subtle)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, style: { ...BTN_SECONDARY }, children: "Cancel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSave, disabled: jsonInvalid, style: { ...BTN_PRIMARY, opacity: jsonInvalid ? 0.5 : 1 }, children: editing.isNew ? "Add" : "Save" })
            ] })
          ]
        }
      )
    }
  );
}
const ROW_HEIGHT = 28;
function formatTime$2(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}
function paramsPreview(params) {
  if (!params) return "";
  if (params.__rnspyTruncated) return `(${params.bytes} bytes, too large to send)`;
  if (params.__rnspyUnserializable) return "(unserializable)";
  try {
    const json = JSON.stringify(params);
    return json === "{}" ? "" : json;
  } catch {
    return "";
  }
}
function prettyParams(params) {
  if (!params) return "";
  try {
    return JSON.stringify(params, null, 2);
  } catch {
    return String(params);
  }
}
function reportOpenFailure(res, routeName) {
  const reason = res?.reason;
  if (res?.stage === "open") {
    zt.error(
      "VS Code not found. Install 'code' CLI via: Shell Command: Install 'code' command in PATH",
      { duration: 5e3 }
    );
    return;
  }
  if (reason === "no-project-root") {
    zt.error('Connect your project folder first — click "Project" in the top bar.', { duration: 5e3 });
    return;
  }
  if (reason === "not-found") {
    zt.error(`No source file found for "${routeName}". Rename the file to match the screen, or open it by hand.`, { duration: 5e3 });
    return;
  }
  if (reason === "project-root-missing" || reason === "project-root-not-a-directory") {
    zt.error('The connected project folder no longer exists. Pick it again from "Project".', { duration: 5e3 });
    return;
  }
  if (reason === "not-available") {
    zt.error("Route resolution needs the desktop app.");
    return;
  }
  if (reason === "no-source-files") {
    zt.error("No source files found in the connected project folder.", { duration: 5e3 });
    return;
  }
  if (reason === "scan-failed") {
    zt.error(`Could not search the project folder: ${res.message || "scan failed"}`, { duration: 5e3 });
    return;
  }
  zt.error(`Could not find the file for "${routeName}"${reason ? ` (${reason})` : ""}.`);
}
const NavigationTab = reactExports.forwardRef(function NavigationTab2({
  navigation,
  online,
  onRefresh,
  onOpenRoute,
  onClear,
  onReload,
  canReload,
  autoRefresh,
  onToggleAutoRefresh
}, ref) {
  const stack = reactExports.useMemo(
    () => navigation && Array.isArray(navigation.stack) ? navigation.stack : [],
    [navigation]
  );
  const history = reactExports.useMemo(
    () => navigation && Array.isArray(navigation.history) ? navigation.history : [],
    [navigation]
  );
  const screens = navigation?.screens || {};
  const diag = navigation?.diag || null;
  const available = navigation?.available;
  const [search, setSearch] = reactExports.useState("");
  const [selectedIdx, setSelectedIdx] = reactExports.useState(null);
  const searchRef = reactExports.useRef(null);
  const scrollRef = reactExports.useRef(null);
  const requestedRef = reactExports.useRef(false);
  reactExports.useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }), []);
  reactExports.useEffect(() => {
    if (online && !requestedRef.current && stack.length === 0) {
      requestedRef.current = true;
      onRefresh?.();
    }
    if (!online) requestedRef.current = false;
  }, [online, stack.length, onRefresh]);
  const openRoute = reactExports.useCallback((routeName) => {
    if (!routeName) return;
    const componentName = screens[routeName] || null;
    Promise.resolve(onOpenRoute?.({ routeName, componentName })).then((res) => {
      if (!res) return;
      if (!res.ok) {
        reportOpenFailure(res, routeName);
        return;
      }
      if (res.ambiguous && res.candidates?.length > 1) {
        zt.success(`Opened ${res.file} (${res.candidates.length} possible matches)`);
      }
    });
  }, [onOpenRoute, screens]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (h) => (h.name || "").toLowerCase().includes(q) || paramsPreview(h.params).toLowerCase().includes(q)
    );
  }, [history, search]);
  const { startIdx, endIdx, topSpacer, bottomSpacer, onScroll } = useVirtualRows({
    scrollRef,
    totalRows: filtered.length,
    rowHeight: ROW_HEIGHT,
    stickyBottom: true
  });
  const focused = stack.length ? stack[stack.length - 1] : null;
  const selected = selectedIdx != null ? filtered[selectedIdx] : null;
  const detail = selected || focused;
  const notDetected = stack.length === 0 && (available === false || diag?.resolved === false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-3)",
      height: 38,
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: searchRef,
          value: search,
          onChange: (e) => {
            setSearch(e.target.value);
            setSelectedIdx(null);
          },
          placeholder: "Filter route history…",
          style: {
            ...INPUT_BASE,
            flex: 1,
            height: 30,
            fontSize: "var(--text-sm)",
            border: "none",
            background: "transparent",
            padding: 0
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: filtered.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 14, background: "var(--border-subtle)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LevelChip,
        {
          active: autoRefresh,
          color: "var(--status-success-text)",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
          label: "Auto",
          onClick: onToggleAutoRefresh,
          title: autoRefresh ? "Resync every 5s (route changes always arrive live)" : "Resync off"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarActions, { onClear, onReload, canReload })
    ] }),
    notDetected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "6px var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--status-warning-border)",
      background: "var(--status-warning-bg)",
      fontSize: "var(--text-xs)",
      fontFamily: "var(--font-mono)",
      color: "var(--status-warning-text)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "React Navigation was not detected in this app." }),
      diag?.error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: diag.error })
    ] }),
    stack.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1)",
      padding: "var(--space-2) var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: SECTION_LABEL, children: "Current screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }, children: stack.map((route, i) => {
        const isLast = i === stack.length - 1;
        const component = screens[route.name];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
          i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => openRoute(route.name),
              title: `Open ${component || route.name} in VS Code` + (component && component !== route.name ? ` (rendered by ${component})` : ""),
              style: {
                display: "inline-flex",
                alignItems: "center",
                height: 22,
                padding: "0 var(--space-2)",
                border: `1px solid ${isLast ? "var(--accent-primary)" : "var(--border-subtle)"}`,
                borderRadius: "var(--radius-sm)",
                background: isLast ? "var(--status-info-bg)" : "var(--bg-card)",
                color: isLast ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                fontWeight: isLast ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                fontFamily: "var(--font-mono)",
                cursor: "pointer"
              },
              children: route.name
            }
          )
        ] }, route.key || `${route.name}-${i}`);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollRef,
        onScroll,
        style: { flex: 1, minHeight: 0, overflow: "auto", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" },
        children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { size: 20, style: { opacity: 0.3 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: search ? "No matching routes" : notDetected ? "React Navigation not detected" : "No route changes yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
            maxWidth: 420,
            textAlign: "center",
            lineHeight: "var(--line-height-normal)"
          }, children: notDetected ? "This panel reads @react-navigation/native. Expo Router builds its own navigation container and is not supported." : search ? "Try a different filter." : "Navigate in your app and every route change will appear here." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          topSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: topSpacer } }),
          filtered.slice(startIdx, endIdx).map((entry, i) => {
            const idx = startIdx + i;
            const isSelected = selectedIdx === idx;
            const preview = paramsPreview(entry.params);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => setSelectedIdx(isSelected ? null : idx),
                onDoubleClick: () => openRoute(entry.name),
                title: "Click to inspect params, double-click to open in VS Code",
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "0 var(--space-3)",
                  height: ROW_HEIGHT,
                  borderBottom: "1px solid var(--border-subtle)",
                  background: isSelected ? "var(--status-info-bg)" : "transparent",
                  cursor: "pointer"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 80, flexShrink: 0, color: "var(--text-tertiary)", fontSize: 10 }, children: formatTime$2(entry.timestamp) }),
                  entry.from && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                    flexShrink: 0,
                    color: "var(--text-tertiary)",
                    fontSize: 10,
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }, children: [
                    entry.from,
                    " →"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: (e) => {
                        e.stopPropagation();
                        openRoute(entry.name);
                      },
                      title: `Open ${entry.name} in VS Code`,
                      style: {
                        flexShrink: 0,
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        color: "var(--text-link)",
                        fontSize: "var(--text-xs)",
                        fontWeight: "var(--font-weight-semibold)",
                        fontFamily: "var(--font-mono)",
                        cursor: "pointer",
                        textDecoration: "none"
                      },
                      onMouseEnter: (e) => e.currentTarget.style.textDecoration = "underline",
                      onMouseLeave: (e) => e.currentTarget.style.textDecoration = "none",
                      children: entry.name
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    flex: 1,
                    minWidth: 0,
                    color: "var(--text-tertiary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    userSelect: "text"
                  }, title: preview, children: preview })
                ]
              },
              entry.id || idx
            );
          }),
          bottomSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: bottomSpacer } })
        ] })
      }
    ),
    detail && detail.params && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flexShrink: 0,
      maxHeight: 200,
      overflow: "auto",
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)",
      padding: "var(--space-2) var(--space-3)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...SECTION_LABEL, marginBottom: "var(--space-1)" }, children: [
        detail.name,
        " params"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
        margin: 0,
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        userSelect: "text"
      }, children: prettyParams(detail.params) })
    ] })
  ] });
});
function formatTime$1(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false });
}
function cellText(v) {
  if (v == null) return "";
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
const PAGE_SIZE = 50;
function WatermelonTab({
  watermelon,
  online,
  onRefresh,
  onLoadPage,
  autoRefresh,
  onToggleAutoRefresh
}) {
  const tables = reactExports.useMemo(
    () => watermelon && Array.isArray(watermelon.tables) ? watermelon.tables : [],
    [watermelon]
  );
  const pages = watermelon?.pages || {};
  const diag = watermelon?.diag || null;
  const available = watermelon?.available;
  const [activeTable, setActiveTable] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [detailRow, setDetailRow] = reactExports.useState(null);
  const requestedRef = reactExports.useRef(false);
  const scrollRef = reactExports.useRef(null);
  const loadingRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (online && !requestedRef.current && tables.length === 0) {
      requestedRef.current = true;
      onRefresh?.();
    }
  }, [online, tables.length, onRefresh]);
  const tableNames = tables.map((t) => t.table);
  const tableSig = tableNames.join("|");
  reactExports.useEffect(() => {
    if (!tableNames.length) {
      setActiveTable(null);
      return;
    }
    if (!activeTable || !tableNames.includes(activeTable)) {
      const largest = tables.slice().sort((a, b) => (b.rowCount || 0) - (a.rowCount || 0))[0];
      setActiveTable(largest ? largest.table : tableNames[0]);
    }
  }, [tableSig]);
  const current = reactExports.useMemo(
    () => tables.find((t) => t.table === activeTable) || null,
    [tables, activeTable]
  );
  const page = activeTable ? pages[activeTable] : null;
  const loadedRows = page?.rows || [];
  const total = page?.total ?? current?.rowCount ?? 0;
  const columns = (current?.columns?.length ? current.columns : page?.columns) || [];
  const hasMore = loadedRows.length < total;
  reactExports.useEffect(() => {
    if (!online || !activeTable) return;
    if (!pages[activeTable] && onLoadPage) {
      loadingRef.current = true;
      onLoadPage(activeTable, 0, PAGE_SIZE);
    }
  }, [activeTable, online]);
  reactExports.useEffect(() => {
    loadingRef.current = false;
  }, [loadedRows.length]);
  const loadMore = reactExports.useCallback(() => {
    if (loadingRef.current || !hasMore || !onLoadPage || !activeTable) return;
    loadingRef.current = true;
    onLoadPage(activeTable, loadedRows.length, PAGE_SIZE);
  }, [hasMore, onLoadPage, activeTable, loadedRows.length]);
  const onScroll = reactExports.useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240) loadMore();
  }, [loadMore]);
  const rows = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return loadedRows;
    return loadedRows.filter((r) => {
      if (String(r.id).toLowerCase().includes(q)) return true;
      return Object.values(r.fields || {}).some((v) => cellText(v).toLowerCase().includes(q));
    });
  }, [loadedRows, search]);
  if (!online && tables.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, style: { opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "Device offline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "WatermelonDB can only be read while the app is connected." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "0 var(--space-3)",
      height: 38,
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...SECTION_LABEL, fontSize: 10 }, children: "WatermelonDB" }),
      current && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: [
        current.table,
        " · ",
        total,
        " row",
        total === 1 ? "" : "s",
        total > 0 ? ` (loaded ${loadedRows.length})` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", width: 220 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 12, style: {
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-tertiary)",
          pointerEvents: "none"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Filter rows",
            style: { ...INPUT_BASE, width: "100%", paddingLeft: 26, fontSize: "var(--text-xs)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        LevelChip,
        {
          active: autoRefresh,
          color: "var(--status-success-text)",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
          label: "Auto",
          onClick: onToggleAutoRefresh,
          title: autoRefresh ? "Auto-refresh on (every 3s)" : "Auto-refresh off"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onRefresh,
          disabled: !online,
          title: "Refresh now",
          style: { ...BTN_GHOST, opacity: online ? 1 : 0.4, cursor: online ? "pointer" : "default" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 12 })
        }
      )
    ] }),
    diag && (diag.resolved === false || diag.error || available === false) && tables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      padding: "6px var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--status-warning-border)",
      background: "var(--status-warning-bg)",
      fontSize: "var(--text-xs)",
      fontFamily: "var(--font-mono)",
      color: "var(--status-warning-text)"
    }, children: [
      diag.resolved === false && !diag.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "WatermelonDB not found — ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "@nozbe/watermelondb" }),
        " is not installed in the app."
      ] }),
      diag.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "WatermelonDB error: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: diag.error })
      ] }),
      diag.resolved && available === false && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "WatermelonDB is installed but no Database instance was captured. Re-run",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Set it up for me" }),
        " — it finds where you call ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "new Database(...)" }),
        " ",
        "and exposes it for you. If your database is not a top-level variable, add",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "if (__DEV__) { global.__rnspyWatermelonDB = database }" }),
        " there yourself, then reload."
      ] }),
      (diag.notes || []).map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.9 }, children: [
        "• ",
        n
      ] }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", minHeight: 0 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        flex: "0 0 200px",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid var(--border-subtle)",
        background: "var(--bg-panel-alt)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          padding: "var(--space-2) var(--space-3)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-sidebar)",
          ...SECTION_LABEL,
          fontSize: 10
        }, children: [
          "TABLES (",
          tables.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: tables.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--space-3)", fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "No tables" }) : tables.slice().sort((a, b) => a.table.localeCompare(b.table)).map((t) => {
          const active = t.table === activeTable;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setActiveTable(t.table);
                setDetailRow(null);
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                padding: "var(--space-2) var(--space-3)",
                border: "none",
                borderBottom: "1px solid var(--border-subtle)",
                borderLeft: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
                background: active ? "var(--status-success-bg)" : "transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                textAlign: "left"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { size: 12, style: { flexShrink: 0, opacity: 0.7 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.table }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 9, color: "var(--text-tertiary)" }, children: t.rowCount })
              ]
            },
            t.table
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, onScroll, style: { flex: 1, minWidth: 0, overflow: "auto" }, children: [
        !current ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 20, style: { opacity: 0.3 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", color: "var(--text-secondary)" }, children: tables.length ? "Select a table" : "No WatermelonDB tables" })
        ] }) : current.error ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "var(--text-sm)", color: "var(--status-danger-text)" }, children: [
          "Error reading ",
          current.table,
          ": ",
          current.error
        ] }) }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", color: "var(--text-secondary)" }, children: search ? "No rows match the filter" : "No records in this table" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { style: {
          width: "auto",
          minWidth: "100%",
          borderCollapse: "collapse",
          fontSize: "var(--text-xs)",
          tableLayout: "auto"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: { position: "sticky", top: 0, zIndex: 1, background: "var(--bg-sidebar)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle, children: "id" }),
            columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { style: thStyle, children: c }, c))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              onClick: () => setDetailRow(r),
              style: { borderBottom: "1px solid var(--border-subtle)", cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { ...tdStyle, color: "var(--accent-primary)" }, children: r.id }),
                columns.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: tdStyle, title: cellText(r.fields?.[c]), children: cellText(r.fields?.[c]) }, c))
              ]
            },
            r.id
          )) })
        ] }),
        current && !current.error && rows.length > 0 && !search && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-2)",
          fontSize: "var(--text-xs)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)"
        }, children: hasMore ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: loadMore,
            style: { ...BTN_GHOST },
            title: "Load more rows",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
              "Load more (",
              loadedRows.length,
              " / ",
              total,
              ")"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.6 }, children: [
          "All ",
          total,
          " row",
          total === 1 ? "" : "s",
          " loaded"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "4px var(--space-3)",
      flexShrink: 0,
      borderTop: "1px solid var(--border-subtle)",
      background: "var(--bg-sidebar)",
      ...SECTION_LABEL,
      fontSize: 10
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        rows.length,
        " row",
        rows.length === 1 ? "" : "s",
        " shown"
      ] }),
      watermelon?.updatedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { opacity: 0.6 }, children: [
        "· updated ",
        formatTime$1(watermelon.updatedAt)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.6 }, children: "· read-only" })
    ] }),
    detailRow && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: () => setDetailRow(null),
        style: {
          position: "absolute",
          inset: 0,
          background: "var(--overlay-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: (e) => e.stopPropagation(),
            style: {
              width: "min(640px, 90%)",
              maxHeight: "80%",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid var(--border-subtle)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { size: 14, color: "var(--accent-primary)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }, children: [
                  current?.table,
                  " · ",
                  detailRow.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDetailRow(null), style: { ...BTN_GHOST, padding: 4 }, title: "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: "var(--space-4)", overflow: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
                margin: 0,
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }, children: JSON.stringify({ id: detailRow.id, ...detailRow.fields }, null, 2) }) })
            ]
          }
        )
      }
    )
  ] });
}
const thStyle = {
  textAlign: "left",
  padding: "6px var(--space-3)",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--border-default)",
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  fontWeight: "var(--font-weight-semibold)",
  color: "var(--text-tertiary)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  background: "var(--bg-sidebar)"
};
const tdStyle = {
  padding: "5px var(--space-3)",
  fontFamily: "var(--font-mono)",
  color: "var(--text-secondary)",
  maxWidth: 280,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};
const CONN_ROW_HEIGHT = 52;
const FRAME_ROW_HEIGHT = 28;
function shortUrl(url) {
  if (!url) return "";
  try {
    return new URL(url).pathname + (new URL(url).search || "");
  } catch {
    return url;
  }
}
function statusColor(status) {
  if (status === "open") return "var(--status-success-text)";
  if (status === "error") return "var(--status-danger-text)";
  return "var(--text-tertiary)";
}
function statusLabel(status) {
  if (status === "open") return "Connected";
  if (status === "error") return "Error";
  if (status === "closed") return "Closed";
  return status;
}
function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour12: false }) + "." + String(d.getMilliseconds()).padStart(3, "0");
}
function formatSize(bytes) {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}K`;
}
const RS = "";
const SIGNALR_MSG_TYPES = {
  1: "Invocation",
  2: "StreamItem",
  3: "Completion",
  4: "StreamInvocation",
  5: "CancelInvocation",
  6: "Ping",
  7: "Close"
};
function isSignalRConnection(conn) {
  if (!conn) return false;
  if (/\/hub[s]?\b/i.test(conn.url || "")) return true;
  if (/signalr/i.test(conn.url || "")) return true;
  const firstFrame = conn.frames?.[0];
  if (firstFrame && typeof firstFrame.data === "string") {
    const d = firstFrame.data.split(RS).filter(Boolean)[0];
    try {
      const m = JSON.parse(d);
      if (m && m.protocol === "json") return true;
    } catch {
    }
  }
  return false;
}
function isPingFrame(data) {
  if (typeof data !== "string") return false;
  const c = data.split(RS).join("").trim();
  return c === '{"type":6}' || c === "{}";
}
function signalRLabel(data) {
  if (typeof data !== "string") return null;
  const parts = data.split(RS).filter(Boolean);
  if (parts.length === 0) return null;
  try {
    const msg = JSON.parse(parts[0]);
    if (!msg || typeof msg.type !== "number") return null;
    const label = SIGNALR_MSG_TYPES[msg.type];
    if (!label) return null;
    if (msg.type === 1 && msg.target) return `${label}:${msg.target}`;
    if (msg.type === 3 && msg.invocationId) return `${label}:#${msg.invocationId}`;
    return label;
  } catch {
    return null;
  }
}
function displayDataOneline(data) {
  if (typeof data !== "string") {
    try {
      return JSON.stringify(data);
    } catch {
      return String(data);
    }
  }
  if (data.indexOf(RS) !== -1) {
    return data.split(RS).filter(Boolean).map((s) => {
      try {
        return JSON.stringify(JSON.parse(s));
      } catch {
        return s;
      }
    }).join(" | ");
  }
  try {
    return JSON.stringify(JSON.parse(data));
  } catch {
    return data;
  }
}
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
    });
  }
}
function prettyPrintFrame(data) {
  if (typeof data !== "string") {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }
  if (data.indexOf(RS) !== -1) {
    return data.split(RS).filter(Boolean).map((part, i) => {
      try {
        return JSON.stringify(JSON.parse(part), null, 2);
      } catch {
        return part;
      }
    }).join("\n\n----- part -----\n\n");
  }
  try {
    const parsed = JSON.parse(data);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return data;
  }
}
function FrameDetail({ frame, onClear }) {
  if (!frame) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)", padding: "var(--space-3)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Braces, { size: 18, style: { opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Select a frame to view its payload" })
    ] });
  }
  const pretty = prettyPrintFrame(frame.data);
  const srLabel = signalRLabel(frame.data);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--bg-panel)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        fontSize: "var(--text-xs)",
        fontFamily: "var(--font-ui)",
        fontWeight: "var(--font-weight-medium)",
        color: frame.dir === "send" ? "var(--status-success-text)" : "var(--status-info-text)"
      }, children: [
        frame.dir === "send" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 10 }),
        frame.dir === "send" ? "Sent" : "Received"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: formatTime(frame.timestamp) }),
      srLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontSize: 9,
        padding: "1px 4px",
        borderRadius: 3,
        background: "var(--accent-muted)",
        color: "var(--accent-primary)",
        fontFamily: "var(--font-ui)",
        fontWeight: "var(--font-weight-medium)"
      }, children: srLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "auto", fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }, children: formatSize(frame.size) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            copyText(pretty);
            zt.success("Frame copied", { duration: 1200 });
          },
          style: { ...BTN_GHOST, height: 22, padding: "0 var(--space-2)" },
          title: "Copy payload",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: "Copy" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onClear,
          style: { ...BTN_GHOST, height: 22, padding: "0 var(--space-2)" },
          title: "Close detail",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 10 }, children: "Close" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
      flex: 1,
      minHeight: 0,
      overflow: "auto",
      margin: 0,
      padding: "var(--space-3)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-xs)",
      lineHeight: "var(--line-height-base)",
      color: "var(--text-primary)",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      background: "var(--bg-panel)"
    }, children: pretty })
  ] });
}
const WebSocketTab = reactExports.forwardRef(function WebSocketTab2({ connections, onClear, onReload, canReload }, ref) {
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [selectedFrameIdx, setSelectedFrameIdx] = reactExports.useState(null);
  const [hidePings, setHidePings] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [connWidth, setConnWidth] = reactExports.useState(280);
  const [detailHeight, setDetailHeight] = reactExports.useState(240);
  const detailResizeRef = reactExports.useRef(false);
  const containerRef = reactExports.useRef(null);
  const draggingRef = reactExports.useRef(false);
  const connScrollRef = reactExports.useRef(null);
  const framesScrollRef = reactExports.useRef(null);
  const searchRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }), []);
  const startResize = reactExports.useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    const move = (ev) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = ev.clientX - rect.left;
      setConnWidth(Math.min(rect.width - 240, Math.max(180, w)));
    };
    const up = () => {
      draggingRef.current = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, []);
  const selectConnection = reactExports.useCallback((wsId) => {
    setSelectedId(wsId);
    setSelectedFrameIdx(null);
  }, []);
  const startDetailResize = reactExports.useCallback((e) => {
    e.preventDefault();
    detailResizeRef.current = true;
    const move = (ev) => {
      if (!detailResizeRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const h = rect.bottom - ev.clientY;
      setDetailHeight(Math.min(rect.height - 120, Math.max(120, h)));
    };
    const up = () => {
      detailResizeRef.current = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  }, []);
  const sorted = reactExports.useMemo(
    () => connections.slice().sort((a, b) => (b.seq ?? 0) - (a.seq ?? 0) || (b.startTime ?? 0) - (a.startTime ?? 0)),
    [connections]
  );
  const selected = reactExports.useMemo(
    () => sorted.find((c) => c.wsId === selectedId) || sorted[0] || null,
    [sorted, selectedId]
  );
  const frames = reactExports.useMemo(() => {
    const all = selected?.frames || [];
    const q = search.trim().toLowerCase();
    return all.filter((f) => {
      if (hidePings && isPingFrame(f.data)) return false;
      if (q && !String(f.data).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [selected, hidePings, search]);
  const connVirt = useVirtualRows({
    scrollRef: connScrollRef,
    totalRows: sorted.length,
    rowHeight: CONN_ROW_HEIGHT
  });
  const frameVirt = useVirtualRows({
    scrollRef: framesScrollRef,
    totalRows: frames.length,
    rowHeight: FRAME_ROW_HEIGHT,
    stickyBottom: true
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, style: { flex: 1, display: "flex", minHeight: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: `0 0 ${connWidth}px`,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "var(--space-2) var(--space-3)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-sidebar)",
        ...SECTION_LABEL,
        fontSize: 10
      }, children: [
        "CONNECTIONS (",
        sorted.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: connScrollRef,
          onScroll: connVirt.onScroll,
          style: { flex: 1, minHeight: 0, overflow: "auto" },
          children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel-alt)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 20, style: { opacity: 0.3 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "No WebSocket connections" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "WebSocket connections will appear here" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            connVirt.topSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: connVirt.topSpacer } }),
            sorted.slice(connVirt.startIdx, connVirt.endIdx).map((conn) => {
              const isSel = conn.wsId === (selected?.wsId || null);
              const isSR = isSignalRConnection(conn);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => selectConnection(conn.wsId),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-3)",
                    cursor: "pointer",
                    height: CONN_ROW_HEIGHT,
                    background: isSel ? "var(--bg-card-hover)" : "transparent",
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background-color 80ms"
                  },
                  onMouseEnter: (e) => {
                    if (!isSel) e.currentTarget.style.background = "var(--bg-card-hover)";
                  },
                  onMouseLeave: (e) => {
                    if (!isSel) e.currentTarget.style.background = "";
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: statusColor(conn.status)
                    } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        lineHeight: "var(--line-height-tight)"
                      }, children: [
                        isSR && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                          fontSize: 8,
                          padding: "0 3px",
                          borderRadius: 2,
                          flexShrink: 0,
                          background: "var(--accent-muted)",
                          color: "var(--accent-primary)",
                          fontFamily: "var(--font-ui)",
                          fontWeight: "var(--font-weight-bold)",
                          lineHeight: "14px"
                        }, children: "SR" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                          fontSize: "var(--text-xs)",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }, title: conn.url, children: shortUrl(conn.url) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                        fontSize: 10,
                        color: "var(--text-tertiary)",
                        fontFamily: "var(--font-ui)",
                        display: "flex",
                        gap: "var(--space-2)",
                        marginTop: 1,
                        lineHeight: "var(--line-height-tight)"
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: statusColor(conn.status) }, children: statusLabel(conn.status) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          conn.frames?.length || 0,
                          " frames"
                        ] })
                      ] })
                    ] })
                  ]
                },
                conn.wsId
              );
            }),
            connVirt.bottomSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: connVirt.bottomSpacer } })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "panel-resizer",
        onMouseDown: startResize,
        style: { cursor: "col-resize", flexShrink: 0 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "var(--bg-panel)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "0 var(--space-3)",
        height: 38,
        flexShrink: 0,
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-panel-alt)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 11, style: { color: "var(--text-tertiary)", flexShrink: 0 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: searchRef,
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Filter frames…",
            style: {
              ...INPUT_BASE,
              flex: 1,
              height: 30,
              fontSize: "var(--text-sm)",
              border: "none",
              background: "transparent",
              padding: 0
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          LevelChip,
          {
            active: hidePings,
            color: "var(--accent-primary)",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 11 }),
            label: "Hide pings",
            onClick: () => setHidePings((v) => !v),
            title: hidePings ? "Show ping/pong frames" : "Hide ping/pong frames"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: 10,
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-mono)"
        }, children: frames.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToolbarActions, { onClear, onReload, canReload })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: framesScrollRef,
          onScroll: frameVirt.onScroll,
          style: { flex: 1, minHeight: 0, overflow: "auto" },
          children: !selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...EMPTY_STATE, background: "var(--bg-panel)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { size: 20, style: { opacity: 0.3 } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-medium)", color: "var(--text-secondary)" }, children: "Select a WebSocket connection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }, children: "Frames sent and received will appear here" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            frameVirt.topSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: frameVirt.topSpacer } }),
            frames.slice(frameVirt.startIdx, frameVirt.endIdx).map((f, i) => {
              const idx = frameVirt.startIdx + i;
              const srLabel = signalRLabel(f.data);
              const isSelected = selectedFrameIdx === idx;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => setSelectedFrameIdx(idx),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "0 var(--space-3)",
                    height: FRAME_ROW_HEIGHT,
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    borderBottom: "1px solid var(--border-subtle)",
                    background: isSelected ? "var(--bg-card-hover)" : f.dir === "send" ? "var(--diff-add-bg)" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 80ms"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flexShrink: 0 }, children: f.dir === "send" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 10, color: "var(--status-success-text)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 10, color: "var(--status-info-text)" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: 80, flexShrink: 0, color: "var(--text-tertiary)", fontSize: 10 }, children: formatTime(f.timestamp) }),
                    srLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                      flexShrink: 0,
                      fontSize: 9,
                      padding: "1px 4px",
                      borderRadius: 3,
                      background: "var(--accent-muted)",
                      color: "var(--accent-primary)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "var(--font-weight-medium)"
                    }, children: srLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                      flex: 1,
                      minWidth: 0,
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      userSelect: "text"
                    }, title: String(f.data), children: displayDataOneline(f.data) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flexShrink: 0, color: "var(--text-tertiary)", fontSize: 10 }, children: formatSize(f.size) })
                  ]
                },
                idx
              );
            }),
            frameVirt.bottomSpacer > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: frameVirt.bottomSpacer } })
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "panel-resizer",
          onMouseDown: startDetailResize,
          style: { cursor: "row-resize", flexShrink: 0, height: 6 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: detailHeight, flexShrink: 0, minHeight: 0, display: "flex" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FrameDetail,
        {
          frame: selectedFrameIdx != null ? frames[selectedFrameIdx] : null,
          onClear: () => setSelectedFrameIdx(null)
        }
      ) })
    ] })
  ] });
});
const TRACE = "10.3 16, 12.2 16, 13.7 11.7, 15.4 20, 17.3 13.8, 19 16, 21.7 16";
function Logo({ size = 18, detail = "auto", ...props }) {
  const compact = detail === "compact" || detail === "auto" && size < 20;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      "aria-label": "React Native Spy",
      style: { display: "block", flexShrink: 0, ...props.style || {} },
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "1", y: "1", width: "30", height: "30", rx: "9", fill: "var(--logo-body)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "1.75",
            y: "1.75",
            width: "28.5",
            height: "28.5",
            rx: "8.4",
            fill: "none",
            stroke: "rgba(255,255,255,0.14)",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "16",
            cy: "16",
            r: "8.25",
            fill: "var(--logo-lens-bg)",
            stroke: "var(--logo-outline)",
            strokeWidth: compact ? 2.75 : 2.25
          }
        ),
        compact ? /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "16", r: "2.75", fill: "var(--logo-lens-ring)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polyline",
          {
            points: TRACE,
            fill: "none",
            stroke: "var(--logo-lens-ring)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
function RnspySettingsModal({
  clients = [],
  hiddenRules = [],
  port = 8097,
  onSetPort,
  projectRoot = "",
  onSetProjectRoot,
  onDisconnect,
  onReload,
  onAddRule,
  onRemoveRule,
  onReset,
  onClose
}) {
  const [draft, setDraft] = reactExports.useState("");
  const [related, setRelated] = reactExports.useState(false);
  const [rootDraft, setRootDraft] = reactExports.useState(projectRoot);
  const [portDraft, setPortDraft] = reactExports.useState(String(port));
  const [confirmReset, setConfirmReset] = reactExports.useState(false);
  const { theme, themes, setTheme, previewTheme, clearPreview } = useTheme();
  const commitPort = () => {
    const parsed = parseInt(portDraft, 10);
    if (Number.isFinite(parsed) && parsed > 0 && parsed < 65536 && parsed !== port) {
      onSetPort?.(parsed);
    } else {
      setPortDraft(String(port));
    }
  };
  const addRule = () => {
    const match = draft.trim();
    if (!match) return;
    onAddRule?.({ match, hideRelated: related });
    setDraft("");
    setRelated(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--overlay)"
      },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "animate-slide-up",
          style: {
            width: 480,
            maxHeight: "80vh",
            background: "var(--bg-panel)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-4)",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--bg-sidebar)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                flex: 1,
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-ui)"
              }, children: "React Native Spy · Settings" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { ...BTN_GHOST, padding: 2, height: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: "var(--space-4)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 10 }),
                  "APPEARANCE",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-ui)",
                    textTransform: "none",
                    letterSpacing: 0,
                    fontWeight: "var(--font-weight-medium)"
                  }, children: "hover to preview" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    role: "radiogroup",
                    "aria-label": "Theme",
                    onMouseLeave: clearPreview,
                    style: {
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "var(--space-2)"
                    },
                    children: themes.map((t) => {
                      const selected = t.id === theme;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          role: "radio",
                          "aria-checked": selected,
                          onClick: () => setTheme(t.id),
                          onMouseEnter: () => previewTheme(t.id),
                          onFocus: () => previewTheme(t.id),
                          onBlur: clearPreview,
                          title: t.blurb,
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--space-1)",
                            padding: "var(--space-2)",
                            border: `1px solid ${selected ? "var(--accent-primary)" : "var(--border-default)"}`,
                            borderRadius: "var(--radius-md)",
                            background: selected ? "var(--accent-muted)" : "var(--bg-card)",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "border-color 120ms ease, background 120ms ease"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                "aria-hidden": "true",
                                style: {
                                  display: "flex",
                                  height: 26,
                                  borderRadius: "var(--radius-sm)",
                                  overflow: "hidden",
                                  border: "1px solid var(--border-subtle)"
                                },
                                children: t.swatch.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: i === 0 ? 2 : 1, background: c } }, i))
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                              display: "flex",
                              alignItems: "center",
                              gap: "var(--space-1)",
                              fontSize: "var(--text-xs)",
                              fontFamily: "var(--font-ui)",
                              fontWeight: selected ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                              color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                              lineHeight: "var(--line-height-tight)"
                            }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Check,
                                {
                                  size: 11,
                                  "aria-hidden": "true",
                                  style: { color: "var(--accent-primary)", opacity: selected ? 1 : 0, flexShrink: 0 }
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: t.label })
                            ] })
                          ]
                        },
                        t.id
                      );
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { size: 10 }),
                  "SERVER"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-ui)",
                    whiteSpace: "nowrap"
                  }, children: "Port" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: portDraft,
                      onChange: (e) => setPortDraft(e.target.value.replace(/[^0-9]/g, "")),
                      onBlur: commitPort,
                      onKeyDown: (e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      },
                      style: { ...INPUT_BASE, width: 80, height: 28, fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)"
                  }, children: [
                    "ws://0.0.0.0:",
                    port || portDraft
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { size: 10 }),
                  "CONNECTED DEVICES",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)"
                  }, children: clients.length })
                ] }),
                !clients.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  padding: "var(--space-3) 0",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-ui)"
                }, children: "No devices connected" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)" }, children: clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--status-success-text)",
                    flexShrink: 0
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 12, color: "var(--text-tertiary)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-ui)",
                      lineHeight: "var(--line-height-tight)"
                    }, children: c.name || c.id }),
                    c.platform && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                      fontSize: 10,
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-mono)",
                      lineHeight: "var(--line-height-tight)"
                    }, children: c.platform })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => {
                        const key = c.deviceId || c.name || c.id || "unknown";
                        onReload?.(key);
                      },
                      style: { ...BTN_GHOST, color: "var(--status-info-text)", fontSize: 10 },
                      title: "Reload app on device",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 10 }),
                        " Reload"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDisconnect?.(c.id), style: {
                    ...BTN_GHOST,
                    color: "var(--status-danger-text)",
                    fontSize: 10
                  }, children: "Disconnect" })
                ] }, c.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 10 }),
                  "PROJECT ROOT"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-ui)",
                  marginBottom: "var(--space-2)",
                  lineHeight: "var(--line-height-normal)"
                }, children: "Absolute path to your RN project. Relative stack trace paths resolve against this." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: rootDraft,
                    onChange: (e) => setRootDraft(e.target.value),
                    onBlur: () => onSetProjectRoot?.(rootDraft),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        onSetProjectRoot?.(rootDraft);
                        e.currentTarget.blur();
                      }
                    },
                    placeholder: "/Users/you/projects/my-rn-app",
                    style: { ...INPUT_BASE, flex: 1, height: 28, fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)" }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 10 }),
                  "HIDDEN REQUEST RULES",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)"
                  }, children: hiddenRules.length })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      value: draft,
                      onChange: (e) => setDraft(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") addRule();
                      },
                      placeholder: "Name or URL fragment…",
                      style: { ...INPUT_BASE, flex: 1, height: 26, fontSize: "var(--text-xs)" }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 10,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-ui)",
                    cursor: "pointer",
                    whiteSpace: "nowrap"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: related,
                        onChange: (e) => setRelated(e.target.checked),
                        style: { accentColor: "var(--accent-primary)", width: 11, height: 11 }
                      }
                    ),
                    "Related"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addRule, style: {
                    ...BTN_PRIMARY,
                    height: 26,
                    padding: "0 var(--space-2)",
                    fontSize: "var(--text-xs)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 10 }),
                    " Add"
                  ] })
                ] }),
                hiddenRules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: hiddenRules.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "4px var(--space-2)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-secondary)",
                  lineHeight: "var(--line-height-tight)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 9, color: "var(--text-tertiary)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: r.match }),
                  r.hideRelated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                    fontSize: 9,
                    padding: "1px 4px",
                    borderRadius: 3,
                    background: "var(--status-warning-bg)",
                    color: "var(--status-warning-text)",
                    fontWeight: "var(--font-weight-medium)"
                  }, children: "related" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRemoveRule?.(r.match), style: {
                    border: "none",
                    background: "transparent",
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                    padding: 1,
                    display: "flex"
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 10 }) })
                ] }, r.match)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 10 }),
                  "DANGER ZONE"
                ] }),
                !confirmReset ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => setConfirmReset(true),
                    style: {
                      ...BTN_DANGER,
                      width: "100%",
                      justifyContent: "center",
                      height: 32,
                      fontSize: "var(--text-xs)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 11 }),
                      "Reset everything"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--status-danger-bg)",
                  border: "1px solid var(--status-danger-border)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)",
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-weight-semibold)",
                    color: "var(--status-danger-text)",
                    fontFamily: "var(--font-ui)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
                    "This will clear everything"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-ui)",
                    lineHeight: "var(--line-height-normal)",
                    marginBottom: "var(--space-3)"
                  }, children: "All captured data, hidden rules, project root, port settings, and connected devices will be reset to defaults. This cannot be undone." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => setConfirmReset(false),
                        style: { ...BTN_SECONDARY, height: 26, fontSize: "var(--text-xs)" },
                        children: "Cancel"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => onReset?.(),
                        style: {
                          ...BTN_DANGER,
                          height: 26,
                          fontSize: "var(--text-xs)",
                          fontWeight: "var(--font-weight-semibold)"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 10 }),
                          "Reset now"
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-2) var(--space-4)",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-sidebar)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                fontSize: "var(--text-xs)",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-ui)"
              }, children: [
                clients.length,
                " online · ",
                hiddenRules.length,
                " rules"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { ...BTN_SECONDARY, height: 26, fontSize: "var(--text-xs)" }, children: "Done" })
            ] })
          ]
        }
      )
    }
  );
}
const REASON_COPY = {
  canceled: null,
  // user dismissed the dialog — not an error
  "no-directory": "No folder was selected.",
  "not-a-directory": "That path is not a folder.",
  "no-package-json": "No package.json here. Pick the folder that contains your app's package.json.",
  "invalid-package-json": "The package.json in this folder could not be parsed.",
  "not-react-native": "This does not look like a React Native project — react-native is not in its dependencies.",
  "no-entry-file": "Could not find an entry file (index.js or App.js) to wire the import into.",
  "entry-file-unreadable": "The entry file could not be read.",
  "path-outside-project": "Refused to write outside the selected project folder.",
  "write-failed": "A file could not be written.",
  "not-available": "Setup is unavailable — the desktop bridge did not load."
};
function reasonText(result) {
  if (!result) return "Something went wrong.";
  const copy = REASON_COPY[result.reason];
  if (copy) return result.message ? `${copy} (${result.message})` : copy;
  return result.message || `Setup failed: ${result.reason || "unknown error"}`;
}
const ACTION_META = {
  create: { label: "Create", badge: BADGE_SUCCESS, Icon: FilePlus2 },
  overwrite: { label: "Regenerate", badge: BADGE_WARNING, Icon: RefreshCw },
  append: { label: "Append", badge: BADGE_INFO, Icon: FileCode2 },
  inject: { label: "Add import", badge: BADGE_INFO, Icon: FileCode2 },
  "already-present": { label: "Up to date", badge: BADGE_SUCCESS, Icon: Check },
  // Nothing is written for a 'manual' step — it tells the user what to add by hand.
  manual: { label: "Your turn", badge: BADGE_WARNING, Icon: Info }
};
const MONO = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)"
};
const HINT = {
  fontSize: "var(--text-xs)",
  color: "var(--text-tertiary)",
  fontFamily: "var(--font-ui)",
  lineHeight: "var(--line-height-normal)"
};
function CodeLine({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    ...MONO,
    padding: "4px var(--space-2)",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-code-block)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-secondary)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
    lineHeight: "var(--line-height-normal)"
  }, children });
}
function StepRow({ step }) {
  const meta = ACTION_META[step.action] || ACTION_META.append;
  const { Icon: Icon2 } = meta;
  const isNoop = step.action === "already-present";
  const isManual = step.action === "manual";
  const showLines = step.lines?.length > 0 && !isNoop;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    padding: "var(--space-2)",
    borderRadius: "var(--radius-md)",
    background: isManual ? "var(--status-warning-bg)" : "var(--bg-card)",
    border: `1px solid ${isManual ? "var(--status-warning-border)" : "var(--border-subtle)"}`,
    opacity: isNoop ? 0.65 : 1
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      marginBottom: showLines ? "var(--space-2)" : 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 11, color: "var(--text-tertiary)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, flex: 1, color: "var(--text-primary)" }, children: step.relativePath }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...meta.badge, fontSize: 10 }, children: meta.label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...HINT, marginLeft: 19 }, children: step.detail }),
    showLines && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      marginLeft: 19,
      marginTop: "var(--space-2)",
      display: "flex",
      flexDirection: "column",
      gap: 2
    }, children: step.lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx(CodeLine, { children: line }, line)) })
  ] });
}
function ProductionWarning({ onRemove }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    gap: "var(--space-2)",
    padding: "var(--space-2)",
    borderRadius: "var(--radius-md)",
    background: "var(--status-warning-bg)",
    border: "1px solid var(--status-warning-border)",
    marginBottom: "var(--space-3)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShieldAlert,
      {
        size: 12,
        color: "var(--status-warning-text)",
        style: { flexShrink: 0, marginTop: 1 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...HINT, color: "var(--text-secondary)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: { color: "var(--status-warning-text)" }, children: "Debug builds only." }),
      " ",
      "This streams console output, network bodies, storage and database contents in plaintext to this app over your local network. Everything is wrapped in ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: "__DEV__" }),
      " so Metro drops it from a release bundle, but don't ship a branch with it wired up",
      onRemove ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " — use ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Remove integration" }),
        " when you're done debugging."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: " — remove the integration when you're done debugging." })
    ] })
  ] });
}
function ProjectSetupModal({
  projectRoot = "",
  host = "localhost",
  port = 8097,
  onPickFolder,
  onPlan,
  onApply,
  onRemove,
  onSetProjectRoot,
  onOpenFile,
  onClose
}) {
  const [phase, setPhase] = reactExports.useState("idle");
  const [dir, setDir] = reactExports.useState(projectRoot);
  const [plan, setPlan] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const [confirming, setConfirming] = reactExports.useState(false);
  const [confirmRemove, setConfirmRemove] = reactExports.useState(false);
  const wmStep = plan?.steps?.find((s) => s.id === "watermelon");
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const runPlan = reactExports.useCallback(async (target) => {
    setPhase("busy");
    setError(null);
    setConfirming(false);
    const res = await onPlan?.(target);
    if (res?.ok) {
      setPlan(res);
      setDir(res.dir);
      setPhase("plan");
    } else {
      setPlan(null);
      setError(res);
      setPhase("error");
    }
  }, [onPlan]);
  const pick = reactExports.useCallback(async () => {
    setError(null);
    const picked = await onPickFolder?.();
    if (!picked?.ok) {
      if (picked?.reason !== "canceled") {
        setError(picked);
        setPhase("error");
      }
      return;
    }
    await runPlan(picked.path);
  }, [onPickFolder, runPlan]);
  const apply = reactExports.useCallback(async () => {
    setPhase("applying");
    const res = await onApply?.(dir);
    if (res?.ok) {
      onSetProjectRoot?.(res.dir);
      setResult(res);
      setPhase("done");
    } else {
      setError(res);
      setPhase("error");
    }
  }, [onApply, dir, onSetProjectRoot]);
  const remove = reactExports.useCallback(async () => {
    setPhase("applying");
    const res = await onRemove?.(dir);
    if (res?.ok) {
      setConfirmRemove(false);
      await runPlan(dir);
    } else {
      setError(res);
      setPhase("error");
    }
  }, [onRemove, dir, runPlan]);
  reactExports.useEffect(() => {
    if (projectRoot && phase === "idle") runPlan(projectRoot);
  }, []);
  const busy = phase === "busy" || phase === "applying";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--overlay)"
      },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "animate-slide-up",
          style: {
            width: 520,
            maxHeight: "80vh",
            background: "var(--bg-panel)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-3) var(--space-4)",
              borderBottom: "1px solid var(--border-subtle)",
              background: "var(--bg-sidebar)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 16 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                flex: 1,
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-semibold)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-ui)"
              }, children: "Connect a React Native project" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { ...BTN_GHOST, padding: 2, height: 20 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflow: "auto", padding: "var(--space-4)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  ...SECTION_LABEL,
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 10 }),
                  "PROJECT FOLDER"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...HINT, marginBottom: "var(--space-2)" }, children: "Pick the folder containing your package.json. The connection file is generated there, gitignored, and imported for you." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    ...MONO,
                    flex: 1,
                    minWidth: 0,
                    height: 28,
                    padding: "0 var(--space-2)",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-default)",
                    background: "var(--bg-input)",
                    color: dir ? "var(--text-primary)" : "var(--text-tertiary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }, children: dir || "No folder selected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: pick,
                      disabled: busy,
                      style: {
                        ...BTN_SECONDARY,
                        height: 28,
                        fontSize: "var(--text-xs)",
                        opacity: busy ? 0.5 : 1,
                        cursor: busy ? "default" : "pointer"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderSearch, { size: 11 }),
                        dir ? "Change…" : "Browse…"
                      ]
                    }
                  )
                ] })
              ] }),
              busy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                ...HINT,
                color: "var(--text-secondary)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 12, className: "animate-spin" }),
                phase === "applying" ? "Writing files…" : "Inspecting project…"
              ] }),
              phase === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                padding: "var(--space-3)",
                borderRadius: "var(--radius-md)",
                background: "var(--status-danger-bg)",
                border: "1px solid var(--status-danger-border)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--status-danger-text)",
                  fontFamily: "var(--font-ui)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
                  "Could not set up this folder"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...HINT, color: "var(--text-secondary)" }, children: reasonText(error) })
              ] }),
              phase === "plan" && plan && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    ...SECTION_LABEL,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10 }),
                    "DETECTED"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                      ...MONO,
                      color: "var(--text-primary)",
                      fontWeight: "var(--font-weight-semibold)"
                    }, children: plan.appName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...BADGE_INFO, fontSize: 10 }, children: [
                      "react-native ",
                      plan.rnVersion
                    ] }),
                    plan.isExpo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...BADGE_INFO, fontSize: 10 }, children: "Expo" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: HINT, children: [
                    "Entry file ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, color: "var(--text-secondary)" }, children: plan.entryFileRelative }),
                    " · connects to ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...MONO, color: "var(--text-secondary)" }, children: [
                      "ws://",
                      plan.host,
                      ":",
                      plan.port
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-5)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    ...SECTION_LABEL,
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    marginBottom: "var(--space-2)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { size: 10 }),
                    plan.upToDate ? "NO CHANGES NEEDED" : `PLANNED CHANGES · ${plan.changeCount}`
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)" }, children: plan.steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsx(StepRow, { step }, step.id)) })
                ] }),
                !plan.upToDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    display: "flex",
                    gap: "var(--space-2)",
                    padding: "var(--space-2)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--status-info-bg)",
                    border: "1px solid var(--status-info-border)",
                    marginBottom: "var(--space-3)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12, color: "var(--status-info-text)", style: { flexShrink: 0, marginTop: 1 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...HINT, color: "var(--text-secondary)" }, children: [
                      "The import goes in as the ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "first" }),
                      " import so the SDK can patch ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: "console" }),
                      ", ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: "fetch" }),
                      ",",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: "XMLHttpRequest" }),
                      " and ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: "WebSocket" }),
                      " ",
                      "before any app code runs.",
                      wmStep?.action === "append" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        " ",
                        "Your WatermelonDB database in",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: wmStep.relativePath }),
                        " is exposed at the end of that file so the database panel can read it."
                      ] }),
                      " ",
                      "Every modified file is backed up as ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: MONO, children: ".rnspy.bak" }),
                      " first."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionWarning, {}),
                  !confirming ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setConfirming(true),
                      style: {
                        ...BTN_PRIMARY,
                        width: "100%",
                        justifyContent: "center",
                        height: 32,
                        fontSize: "var(--text-xs)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus2, { size: 11 }),
                        "Set up automatically"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--status-warning-bg)",
                    border: "1px solid var(--status-warning-border)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-2)",
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--font-weight-semibold)",
                      color: "var(--status-warning-text)",
                      fontFamily: "var(--font-ui)"
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12 }),
                      "Write ",
                      plan.changeCount,
                      " file",
                      plan.changeCount === 1 ? "" : "s",
                      " into your project?"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...HINT, color: "var(--text-secondary)", marginBottom: "var(--space-3)" }, children: [
                      "This modifies files in",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, color: "var(--text-secondary)" }, children: plan.dir }),
                      ". Backups are written alongside each changed file, and you can undo this from here afterwards."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setConfirming(false),
                          style: { ...BTN_SECONDARY, height: 26, fontSize: "var(--text-xs)" },
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: apply,
                          style: {
                            ...BTN_PRIMARY,
                            height: 26,
                            fontSize: "var(--text-xs)",
                            fontWeight: "var(--font-weight-semibold)"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10 }),
                            "Write files"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }),
                plan.upToDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...HINT, color: "var(--text-secondary)" }, children: "This project is already wired up. Reload your app to connect." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionWarning, { onRemove: true }),
                  !confirmRemove ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => setConfirmRemove(true),
                      style: {
                        ...BTN_DANGER,
                        width: "100%",
                        justifyContent: "center",
                        height: 30,
                        fontSize: "var(--text-xs)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 11 }),
                        "Remove integration"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--status-danger-bg)",
                    border: "1px solid var(--status-danger-border)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...HINT, color: "var(--text-secondary)", marginBottom: "var(--space-3)" }, children: [
                      "Deletes the generated connection file and removes the import from",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, color: "var(--text-secondary)" }, children: plan.entryFileRelative }),
                      wmStep?.action === "already-present" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        ", and the database line from",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, color: "var(--text-secondary)" }, children: wmStep.relativePath })
                      ] }),
                      ". The .gitignore entries are left alone."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => setConfirmRemove(false),
                          style: { ...BTN_SECONDARY, height: 26, fontSize: "var(--text-xs)" },
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: remove,
                          style: { ...BTN_DANGER, height: 26, fontSize: "var(--text-xs)" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 10 }),
                            "Remove"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }),
              phase === "done" && result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-3)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--status-success-text)",
                  fontFamily: "var(--font-ui)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                  result.appName,
                  " is wired up"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginBottom: "var(--space-4)"
                }, children: [
                  result.written.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "4px var(--space-2)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10, color: "var(--status-success-text)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, flex: 1, color: "var(--text-secondary)" }, children: w.path }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...BADGE_SUCCESS, fontSize: 10 }, children: ACTION_META[w.action]?.label || w.action })
                  ] }, w.id)),
                  result.skipped.map((s) => {
                    const isManual = s.reason === "manual";
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      padding: "4px var(--space-2)",
                      borderRadius: "var(--radius-sm)",
                      background: isManual ? "var(--status-warning-bg)" : "var(--bg-card)",
                      border: `1px solid ${isManual ? "var(--status-warning-border)" : "var(--border-subtle)"}`,
                      opacity: isManual ? 1 : 0.65
                    }, children: [
                      isManual ? /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 10, color: "var(--status-warning-text)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 10, color: "var(--text-tertiary)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { ...MONO, flex: 1, color: "var(--text-secondary)" }, children: s.path }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        ...isManual ? BADGE_WARNING : BADGE_SUCCESS,
                        fontSize: 10
                      }, children: isManual ? "Your turn" : "Up to date" })
                    ] }, s.id);
                  })
                ] }),
                result.skipped.some((s) => s.reason === "manual") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "var(--space-3)" }, children: result.skipped.filter((s) => s.reason === "manual").map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginBottom: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { ...HINT, marginBottom: "var(--space-2)" }, children: s.detail }),
                  (s.lines || []).map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx(CodeLine, { children: line }, line))
                ] }, s.id)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                  display: "flex",
                  gap: "var(--space-2)",
                  padding: "var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--status-info-bg)",
                  border: "1px solid var(--status-info-border)",
                  marginBottom: "var(--space-3)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12, color: "var(--status-info-text)", style: { flexShrink: 0, marginTop: 1 } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { ...HINT, color: "var(--text-secondary)" }, children: [
                    "Reload your app (press ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "R" }),
                    " twice, or ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "r" }),
                    " in Expo) and a device tab will appear here."
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ProductionWarning, { onRemove: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "var(--space-2)" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => onOpenFile?.(result.entryFile),
                      style: { ...BTN_SECONDARY, flex: 1, justifyContent: "center", height: 30, fontSize: "var(--text-xs)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { size: 11 }),
                        "Open ",
                        result.entryFileRelative
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => runPlan(result.dir),
                      style: { ...BTN_SECONDARY, height: 30, fontSize: "var(--text-xs)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 11 }),
                        "Re-check"
                      ]
                    }
                  )
                ] })
              ] }),
              phase === "idle" && !dir && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-5) 0",
                textAlign: "center"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderSearch, { size: 22, color: "var(--text-tertiary)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: HINT, children: "Choose your React Native project to set up the connection automatically." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--space-2) var(--space-4)",
              borderTop: "1px solid var(--border-subtle)",
              background: "var(--bg-sidebar)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...MONO, color: "var(--text-tertiary)" }, children: [
                "ws://",
                host,
                ":",
                port
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, style: { ...BTN_SECONDARY, height: 26, fontSize: "var(--text-xs)" }, children: "Done" })
            ] })
          ]
        }
      )
    }
  );
}
const INITIAL = {
  status: "idle",
  currentVersion: "",
  version: null,
  releaseNotes: null,
  percent: 0,
  bytesPerSecond: 0,
  transferred: 0,
  total: 0,
  error: null,
  canInstallInApp: true,
  manualDownloadUrl: ""
};
function useUpdater() {
  const updater = typeof window !== "undefined" ? window.electron?.updater : null;
  const [state, setState] = reactExports.useState(INITIAL);
  reactExports.useEffect(() => {
    if (!updater) return void 0;
    let alive = true;
    updater.getState().then((s) => {
      if (alive && s) setState(s);
    }).catch(() => {
    });
    const off = updater.onState((s) => {
      if (alive) setState(s);
    });
    return () => {
      alive = false;
      off?.();
    };
  }, [updater]);
  const check = reactExports.useCallback(
    (opts) => updater?.check(opts) ?? Promise.resolve({ ok: false }),
    [updater]
  );
  const download = reactExports.useCallback(
    () => updater?.download() ?? Promise.resolve({ ok: false }),
    [updater]
  );
  const install = reactExports.useCallback(
    () => updater?.install() ?? Promise.resolve({ ok: false }),
    [updater]
  );
  const openReleases = reactExports.useCallback(
    () => updater?.openReleases() ?? Promise.resolve({ ok: false }),
    [updater]
  );
  return { ...state, available: !!updater, check, download, install, openReleases };
}
const PILL = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-1)",
  height: 24,
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-md)",
  border: "1px solid transparent",
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-weight-medium)",
  fontFamily: "var(--font-ui)",
  lineHeight: "var(--line-height-tight)",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "all 120ms ease"
};
function UpdateButton() {
  const {
    available,
    status,
    version,
    percent,
    canInstallInApp,
    error,
    download,
    install,
    check
  } = useUpdater();
  const [busy, setBusy] = reactExports.useState(false);
  if (!available) return null;
  if (status !== "available" && status !== "downloading" && status !== "ready" && status !== "error") {
    return null;
  }
  if (status === "downloading") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        title: `Downloading update${version ? ` ${version}` : ""} — ${percent}%`,
        style: {
          ...PILL,
          cursor: "default",
          background: "var(--status-info-bg)",
          color: "var(--status-info-text)",
          borderColor: "var(--status-info-border)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            percent,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              style: {
                width: 44,
                height: 3,
                borderRadius: 2,
                overflow: "hidden",
                background: "var(--status-info-border)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                display: "block",
                height: "100%",
                width: `${percent}%`,
                background: "currentColor",
                transition: "width 200ms ease"
              } })
            }
          )
        ]
      }
    );
  }
  if (status === "ready") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: async () => {
          setBusy(true);
          const res = await install();
          if (!res?.ok) {
            setBusy(false);
            zt.error(res?.reason === "dev-mode" ? "Updates only work in the packaged app" : "Could not install the update");
          }
        },
        disabled: busy,
        title: `Version ${version || "update"} downloaded — restart to apply`,
        style: {
          ...PILL,
          background: "var(--status-success-bg)",
          color: "var(--status-success-text)",
          borderColor: "var(--status-success-border)",
          opacity: busy ? 0.6 : 1
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Restart to update" })
        ]
      }
    );
  }
  if (status === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => check(),
        title: error ? `${error} — click to retry` : "Update check failed — click to retry",
        style: {
          ...PILL,
          background: "var(--status-danger-bg)",
          color: "var(--status-danger-text)",
          borderColor: "var(--status-danger-border)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 11 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Update failed" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: async () => {
        setBusy(true);
        const res = await download();
        setBusy(false);
        if (res?.ok && res.method === "external") {
          zt.success("Opened the download page");
        } else if (!res?.ok) {
          zt.error(res?.reason === "dev-mode" ? "Updates only work in the packaged app" : "Could not start the download");
        }
      },
      disabled: busy,
      title: canInstallInApp ? `Version ${version} is available — click to download` : `Version ${version} is available — opens the download page`,
      style: {
        ...PILL,
        background: "var(--accent-primary)",
        color: "var(--accent-fg)",
        borderColor: "transparent",
        fontWeight: "var(--font-weight-semibold)",
        opacity: busy ? 0.6 : 1
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "var(--accent-primary-hover)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "var(--accent-primary)";
      },
      children: [
        canInstallInApp ? /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Update",
          version ? ` to ${version}` : ""
        ] })
      ]
    }
  );
}
const MENU_W = 248;
function ThemeMenu() {
  const { theme, themes, setTheme, previewTheme, clearPreview, meta } = useTheme();
  const [open, setOpen] = reactExports.useState(false);
  const [pos, setPos] = reactExports.useState(null);
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const btnRef = reactExports.useRef(null);
  const menuRef = reactExports.useRef(null);
  const itemRefs = reactExports.useRef([]);
  const close = (restoreFocus = true) => {
    setOpen(false);
    clearPreview();
    if (restoreFocus) btnRef.current?.focus();
  };
  const openMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const left = Math.max(8, Math.min(r.right - MENU_W, window.innerWidth - MENU_W - 8));
    setPos({ top: r.bottom + 6, left });
    setActiveIdx(Math.max(0, themes.findIndex((t) => t.id === theme)));
    setOpen(true);
  };
  reactExports.useLayoutEffect(() => {
    if (open) itemRefs.current[activeIdx]?.focus();
  }, [open, activeIdx]);
  reactExports.useEffect(() => {
    if (!open) return void 0;
    let armed = false;
    const raf = requestAnimationFrame(() => {
      armed = true;
    });
    const onDown = (e) => {
      if (!armed) return;
      if (menuRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      close(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const onBlur = () => close(false);
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onBlur);
    };
  }, [open]);
  const onMenuKeyDown = (e) => {
    const last = themes.length - 1;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const n = activeIdx >= last ? 0 : activeIdx + 1;
      setActiveIdx(n);
      previewTheme(themes[n].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const n = activeIdx <= 0 ? last : activeIdx - 1;
      setActiveIdx(n);
      previewTheme(themes[n].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
      previewTheme(themes[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(last);
      previewTheme(themes[last].id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setTheme(themes[activeIdx].id);
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        ref: btnRef,
        type: "button",
        onClick: () => open ? close() : openMenu(),
        title: `Theme: ${meta.label}`,
        "aria-label": `Change theme, current theme ${meta.label}`,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        style: {
          ...BTN_GHOST,
          gap: "var(--space-1)",
          color: open ? "var(--text-primary)" : "var(--text-tertiary)",
          background: open ? "var(--bg-card)" : "transparent"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": "true",
              style: {
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent-primary)",
                border: "1px solid var(--border-default)",
                flexShrink: 0
              }
            }
          )
        ]
      }
    ),
    open && pos && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: menuRef,
          role: "menu",
          "aria-label": "Theme",
          onKeyDown: onMenuKeyDown,
          onMouseLeave: clearPreview,
          className: "animate-fade-in",
          style: {
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: MENU_W,
            zIndex: 1400,
            padding: "var(--space-1)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px var(--space-2) 3px",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-semibold)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-ui)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Theme" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { textTransform: "none", letterSpacing: 0, fontWeight: "var(--font-weight-medium)" }, children: "hover to preview" })
            ] }),
            themes.map((t, i) => {
              const selected = t.id === theme;
              const active = i === activeIdx;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  ref: (el) => {
                    itemRefs.current[i] = el;
                  },
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": selected,
                  tabIndex: active ? 0 : -1,
                  onClick: () => {
                    setTheme(t.id);
                    close();
                  },
                  onMouseEnter: () => {
                    setActiveIdx(i);
                    previewTheme(t.id);
                  },
                  onFocus: () => previewTheme(t.id),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    width: "100%",
                    padding: "6px var(--space-2)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: active ? "var(--bg-card-hover)" : "transparent",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-ui)",
                    transition: "background 120ms ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        "aria-hidden": "true",
                        style: {
                          display: "flex",
                          flexShrink: 0,
                          width: 30,
                          height: 18,
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          border: "1px solid var(--border-default)"
                        },
                        children: t.swatch.map((c, si) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: si === 0 ? 2 : 1, background: c } }, si))
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        display: "block",
                        fontSize: "var(--text-sm)",
                        fontWeight: selected ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
                        color: selected ? "var(--text-primary)" : "var(--text-secondary)",
                        lineHeight: "var(--line-height-tight)"
                      }, children: t.label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                        display: "block",
                        fontSize: "var(--text-xs)",
                        color: "var(--text-tertiary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: "var(--line-height-tight)",
                        marginTop: 1
                      }, children: t.blurb })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Check,
                      {
                        size: 13,
                        style: {
                          flexShrink: 0,
                          color: "var(--accent-primary)",
                          opacity: selected ? 1 : 0
                        },
                        "aria-hidden": "true"
                      }
                    )
                  ]
                },
                t.id
              );
            })
          ]
        }
      ),
      document.body
    )
  ] });
}
const IssuesButton = reactExports.forwardRef(function IssuesButton2({ errorCount = 0, warnCount = 0, total = 0, onClick }, ref) {
  const hasErrors = errorCount > 0;
  const hasWarnings = warnCount > 0;
  const clean = !hasErrors && !hasWarnings;
  const tone = hasErrors ? { fg: "var(--status-danger-text)", bg: "var(--status-danger-bg)", bd: "var(--status-danger-border)" } : hasWarnings ? { fg: "var(--status-warning-text)", bg: "var(--status-warning-bg)", bd: "var(--status-warning-border)" } : { fg: "var(--text-tertiary)", bg: "transparent", bd: "transparent" };
  const occurrences = errorCount + warnCount;
  const label = clean ? "No issues detected" : `${errorCount} error${errorCount === 1 ? "" : "s"}, ${warnCount} warning${warnCount === 1 ? "" : "s"} across ${total} distinct issue${total === 1 ? "" : "s"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      ref,
      onClick,
      title: label,
      "aria-label": `${label}. Open issues.`,
      "aria-haspopup": "dialog",
      style: {
        ...BTN_GHOST,
        gap: "var(--space-1)",
        color: tone.fg,
        background: tone.bg,
        border: `1px solid ${tone.bd}`
      },
      children: [
        clean ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 12, "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12, "aria-hidden": "true" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
          // Reserved width so the toolbar doesn't shift as counts change.
          minWidth: "2ch",
          textAlign: "left"
        }, children: clean ? "0" : occurrences > 999 ? "999+" : occurrences })
      ]
    }
  );
});
const SEVERITY = { error: 2, warn: 1 };
const SOURCES = [
  { id: "setup", label: "Setup" },
  { id: "console", label: "Console" },
  { id: "network", label: "Network" },
  { id: "server", label: "Server" },
  { id: "storage", label: "Storage" },
  { id: "database", label: "Database" }
];
const NOISE = [
  /^client connected\b/i,
  /^client disconnected\b/i,
  /^client force-disconnected\b/i,
  /\bsocket error\b/i,
  /^replacing stale connection\b/i,
  /^client .* identified as\b/i,
  /^sent ".*" to device\b/i,
  /^websocket server listening\b/i
];
function isNoise(message) {
  const m = String(message || "").trim();
  return NOISE.some((re) => re.test(m));
}
function argToText(arg) {
  if (arg == null) return String(arg);
  if (typeof arg === "object") {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}
function firstLine(text, max = 200) {
  const line = String(text || "").split("\n")[0].trim();
  return line.length > max ? line.slice(0, max) + "…" : line;
}
function addIssue(map, issue) {
  const existing = map.get(issue.signature);
  if (existing) {
    existing.count += 1;
    if ((issue.timestamp || 0) > (existing.timestamp || 0)) {
      existing.timestamp = issue.timestamp;
      existing.detail = issue.detail;
      existing.caller = issue.caller || existing.caller;
      existing.stack = issue.stack || existing.stack;
    }
    return;
  }
  map.set(issue.signature, { ...issue, count: 1 });
}
function useIssues({ devices = [], serverLogs = [] } = {}) {
  return reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const dev of devices) {
      const where = dev.name || dev.key;
      for (const log of dev.consoleLogs || []) {
        if (log.level !== "error" && log.level !== "warn") continue;
        const text = (log.args || []).map(argToText).join(" ");
        if (!text.trim()) continue;
        addIssue(map, {
          id: `console:${dev.key}:${log.id}`,
          source: "console",
          severity: log.level,
          title: firstLine(text),
          detail: text,
          device: where,
          deviceKey: dev.key,
          caller: log.caller || null,
          stack: log.stack || null,
          timestamp: log.timestamp,
          // Level + message identity, so the same warning repeated merges.
          signature: `console|${dev.key}|${log.level}|${firstLine(text, 160)}`
        });
      }
      for (const req of dev.networkRequests || []) {
        if (req.pending) continue;
        const status = req.status;
        const failed = req.error || status == null || status === 0 || status >= 400;
        if (!failed) continue;
        const method = (req.method || "GET").toUpperCase();
        let label;
        let severity;
        if (req.error || status == null || status === 0) {
          label = `${method} failed — ${req.error || "no response"}`;
          severity = "error";
        } else {
          label = `${method} ${status}`;
          severity = status >= 500 ? "error" : "warn";
        }
        addIssue(map, {
          id: `network:${dev.key}:${req.id}`,
          source: "network",
          severity,
          title: `${label} · ${req.url || ""}`,
          detail: [
            `${method} ${req.url || ""}`,
            `Status: ${status == null || status === 0 ? "failed" : status}`,
            req.error ? `Error: ${req.error}` : null,
            req.duration != null ? `Duration: ${Math.round(req.duration)}ms` : null
          ].filter(Boolean).join("\n"),
          device: where,
          deviceKey: dev.key,
          timestamp: req.startTime,
          // Group by endpoint + outcome, not by request id — one broken endpoint
          // hit repeatedly is one issue.
          signature: `network|${dev.key}|${method}|${status || "fail"}|${(req.url || "").split("?")[0]}`
        });
      }
      const st = dev.storage;
      if (st?.error) {
        addIssue(map, {
          id: `storage:${dev.key}:error`,
          source: "storage",
          severity: "error",
          title: `Storage read failed — ${firstLine(st.error)}`,
          detail: String(st.error),
          device: where,
          deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `storage|${dev.key}|${firstLine(st.error, 160)}`
        });
      }
      if (st?.diag && st.diag.asyncResolved === false) {
        addIssue(map, {
          id: `setup:${dev.key}:asyncstorage`,
          source: "setup",
          severity: "warn",
          title: "AsyncStorage is not available",
          detail: [
            "The SDK could not load @react-native-async-storage/async-storage,",
            "so the AsyncStorage section of the Storage panel will stay empty.",
            "",
            "Fix: install it, then rebuild the native app —",
            "  npm install @react-native-async-storage/async-storage",
            "  npx pod-install ios",
            "",
            "If it is already installed, a JS-only reload is not enough:",
            "the native module needs a fresh build."
          ].join("\n"),
          device: where,
          deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `setup|${dev.key}|asyncstorage`
        });
      }
      if (st?.diag?.mmkvResolved === false) {
        const why = st.diag.mmkvError || "no MMKV instance was found";
        const notInstalled = /require failed|cannot find module|not installed/i.test(why);
        addIssue(map, {
          id: `setup:${dev.key}:mmkv`,
          source: "setup",
          severity: "warn",
          title: notInstalled ? "MMKV is not available" : "MMKV is installed but no instance was found",
          detail: notInstalled ? [
            `react-native-mmkv could not be loaded: ${why}`,
            "The MMKV section of the Storage panel will stay empty.",
            "",
            "Fix: npm install react-native-mmkv, then rebuild the native app."
          ].join("\n") : [
            `MMKV could not be inspected: ${why}`,
            "",
            "The SDK auto-detects instances created after it loads. If yours is",
            "created earlier, expose it once:",
            "  global.__rnspyMMKV = myStorage"
          ].join("\n"),
          device: where,
          deviceKey: dev.key,
          timestamp: st.updatedAt,
          signature: `setup|${dev.key}|mmkv|${notInstalled ? "missing" : "no-instance"}`
        });
      }
      if (dev.watermelon?.diag?.resolved === false) {
        const why = dev.watermelon.diag.error || dev.watermelon.error || "require failed";
        addIssue(map, {
          id: `setup:${dev.key}:watermelon`,
          source: "setup",
          severity: "warn",
          title: "WatermelonDB is not available",
          detail: [
            `@nozbe/watermelondb could not be loaded: ${why}`,
            "The WatermelonDB panel will stay empty.",
            "",
            "If your app does not use WatermelonDB, ignore this.",
            'Otherwise re-run "Set it up for me" — setup finds where you call',
            "new Database(...) and exposes that instance automatically. If your",
            "database is not a top-level variable, add this line there yourself:",
            "  if (__DEV__) { global.__rnspyWatermelonDB = database }"
          ].join("\n"),
          device: where,
          deviceKey: dev.key,
          timestamp: dev.watermelon.updatedAt,
          signature: `setup|${dev.key}|watermelon`
        });
      }
      for (const note of st?.diag?.notes || []) {
        if (/require failed/i.test(note)) continue;
        addIssue(map, {
          id: `storage:${dev.key}:note:${note}`,
          source: "storage",
          severity: "warn",
          title: firstLine(note),
          detail: String(note),
          device: where,
          deviceKey: dev.key,
          timestamp: st?.updatedAt,
          signature: `storage|${dev.key}|note|${firstLine(note, 160)}`
        });
      }
      const wm = dev.watermelon;
      if (wm?.error) {
        addIssue(map, {
          id: `database:${dev.key}:error`,
          source: "database",
          severity: "error",
          title: `WatermelonDB error — ${firstLine(wm.error)}`,
          detail: String(wm.error),
          device: where,
          deviceKey: dev.key,
          timestamp: wm.updatedAt,
          signature: `database|${dev.key}|${firstLine(wm.error, 160)}`
        });
      }
      for (const t of wm?.tables || []) {
        if (!t?.error) continue;
        addIssue(map, {
          id: `database:${dev.key}:${t.table}`,
          source: "database",
          severity: "error",
          title: `Table "${t.table}" — ${firstLine(t.error)}`,
          detail: String(t.error),
          device: where,
          deviceKey: dev.key,
          timestamp: wm?.updatedAt,
          signature: `database|${dev.key}|table|${t.table}|${firstLine(t.error, 120)}`
        });
      }
    }
    for (const entry of serverLogs) {
      if (entry.level !== "error" && entry.level !== "warn") continue;
      if (isNoise(entry.message)) continue;
      addIssue(map, {
        id: `server:${entry.timestamp}:${entry.message}`,
        source: "server",
        severity: entry.level,
        title: firstLine(entry.message),
        detail: String(entry.message || ""),
        device: null,
        deviceKey: null,
        timestamp: entry.timestamp,
        signature: `server|${entry.level}|${firstLine(entry.message, 160)}`
      });
    }
    const issues = Array.from(map.values()).sort((a, b) => {
      const s = (SEVERITY[b.severity] || 0) - (SEVERITY[a.severity] || 0);
      if (s !== 0) return s;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    const errorCount = issues.reduce((n, i) => n + (i.severity === "error" ? i.count : 0), 0);
    const warnCount = issues.reduce((n, i) => n + (i.severity === "warn" ? i.count : 0), 0);
    const bySource = {};
    for (const s of SOURCES) bySource[s.id] = 0;
    for (const i of issues) bySource[i.source] = (bySource[i.source] || 0) + i.count;
    return {
      issues,
      errorCount,
      warnCount,
      // Distinct problems, which is what the badge shows — 200 repeats of one
      // broken endpoint is one thing to fix, not 200.
      total: issues.length,
      occurrences: errorCount + warnCount,
      bySource
    };
  }, [devices, serverLogs]);
}
const SOURCE_ICON = {
  setup: PlugZap,
  console: Terminal,
  network: Globe,
  server: Server,
  storage: HardDrive,
  database: Database
};
function formatWhen(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const p = (v, n = 2) => String(v).padStart(n, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function shortCaller(caller) {
  if (!caller?.file) return null;
  const file = caller.file.split("/").pop();
  return caller.line ? `${file}:${caller.line}` : file;
}
function IssuesModal({
  issues = [],
  errorCount = 0,
  warnCount = 0,
  bySource = {},
  onOpenInEditor,
  onClose,
  // The element to hand focus back to on close. Passed explicitly rather than
  // captured from document.activeElement: a click doesn't necessarily focus the
  // button it activates, so capturing would sometimes restore to <body>.
  returnFocusRef
}) {
  const [severity, setSeverity] = reactExports.useState("all");
  const [source, setSource] = reactExports.useState("all");
  const [expanded, setExpanded] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const cardRef = reactExports.useRef(null);
  const closeRef = reactExports.useRef(null);
  const restoreRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    restoreRef.current = returnFocusRef?.current || document.activeElement;
    closeRef.current?.focus();
    return () => {
      const el = restoreRef.current;
      if (el && typeof el.focus === "function") el.focus();
    };
  }, [returnFocusRef]);
  reactExports.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key !== "Tab") return;
      const card = cardRef.current;
      if (!card) return;
      const focusable = card.querySelectorAll(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const filtered = reactExports.useMemo(() => issues.filter((i) => {
    if (severity !== "all" && i.severity !== severity) return false;
    if (source !== "all" && i.source !== source) return false;
    return true;
  }), [issues, severity, source]);
  const toggle = (id) => setExpanded((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const copyAll = () => {
    const text = filtered.map((i) => {
      const head = `[${i.severity.toUpperCase()}] ${i.source}${i.device ? ` · ${i.device}` : ""}${i.count > 1 ? ` (×${i.count})` : ""}`;
      return `${head}
${i.detail}
`;
    }).join("\n");
    copyText$1(text).then((ok) => {
      if (ok) zt.success(`Copied ${filtered.length} issue${filtered.length === 1 ? "" : "s"}`);
    });
  };
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        onClick: onClose,
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 1250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--overlay)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: cardRef,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": "issues-title",
            className: "animate-slide-up",
            onClick: (e) => e.stopPropagation(),
            style: {
              width: 680,
              maxWidth: "92vw",
              maxHeight: "82vh",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg-panel)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-4)",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-sidebar)",
                flexShrink: 0
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    size: 14,
                    style: { color: errorCount > 0 ? "var(--status-danger-text)" : "var(--status-warning-text)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { id: "issues-title", style: {
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-ui)"
                }, children: "Issues" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)"
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--status-danger-text)" }, children: [
                    errorCount,
                    " errors"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-tertiary)" }, children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--status-warning-text)" }, children: [
                    warnCount,
                    " warnings"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copyAll, style: { ...BTN_GHOST }, disabled: !filtered.length, title: "Copy visible issues", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
                  "Copy all"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    ref: closeRef,
                    onClick: onClose,
                    "aria-label": "Close issues",
                    style: { ...BTN_GHOST, padding: 2, height: 22 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-panel-alt)",
                flexShrink: 0,
                flexWrap: "wrap"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "seg", role: "group", "aria-label": "Severity", children: [
                  { id: "all", label: "All", n: errorCount + warnCount },
                  { id: "error", label: "Errors", n: errorCount },
                  { id: "warn", label: "Warnings", n: warnCount }
                ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "seg-btn",
                    "aria-pressed": severity === s.id,
                    onClick: () => setSeverity(s.id),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tick", "aria-hidden": "true", children: "✓" }),
                      s.label,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.7 }, children: s.n })
                    ]
                  },
                  s.id
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rule", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "seg", role: "group", "aria-label": "Source", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "seg-btn",
                      "aria-pressed": source === "all",
                      onClick: () => setSource("all"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tick", "aria-hidden": "true", children: "✓" }),
                        "Any"
                      ]
                    }
                  ),
                  SOURCES.filter((s) => (bySource[s.id] || 0) > 0).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "seg-btn",
                      "aria-pressed": source === s.id,
                      onClick: () => setSource(s.id),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tick", "aria-hidden": "true", children: "✓" }),
                        s.label,
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.7 }, children: bySource[s.id] })
                      ]
                    },
                    s.id
                  ))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, overflow: "auto" }, children: !filtered.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
                padding: "var(--space-8) var(--space-4)",
                textAlign: "center"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 22, style: { color: "var(--status-success-text)", opacity: 0.8 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-ui)"
                }, children: issues.length ? "Nothing matches these filters" : "No issues detected" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "var(--text-xs)",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-ui)",
                  maxWidth: 380,
                  lineHeight: "var(--line-height-normal)"
                }, children: issues.length ? "Try widening the severity or source filter." : "Console errors, failed requests, and server or storage problems will collect here." })
              ] }) : filtered.map((issue) => {
                const Icon2 = SOURCE_ICON[issue.source] || TriangleAlert;
                const isErr = issue.severity === "error";
                const open = expanded.has(issue.id);
                const caller = shortCaller(issue.caller);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      borderBottom: "1px solid var(--border-subtle)",
                      background: isErr ? "color-mix(in srgb, var(--status-danger-bg) 35%, transparent)" : "transparent"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-2)",
                      padding: "var(--space-2) var(--space-4)"
                    }, children: [
                      isErr ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 13, style: { color: "var(--status-danger-text)", flexShrink: 0, marginTop: 1 }, "aria-hidden": "true" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 13, style: { color: "var(--status-warning-text)", flexShrink: 0, marginTop: 1 }, "aria-hidden": "true" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: isErr ? "Error" : "Warning" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            onClick: () => toggle(issue.id),
                            "aria-expanded": open,
                            style: {
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              border: "none",
                              background: "transparent",
                              padding: 0,
                              color: "var(--text-primary)",
                              fontSize: "var(--text-xs)",
                              fontFamily: "var(--font-mono)",
                              lineHeight: "var(--line-height-normal)",
                              cursor: "pointer",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: open ? "normal" : "nowrap",
                              wordBreak: open ? "break-word" : "normal"
                            },
                            children: issue.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          marginTop: 2,
                          flexWrap: "wrap",
                          fontSize: "var(--text-2xs)",
                          fontFamily: "var(--font-ui)",
                          color: "var(--text-tertiary)"
                        }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: 3 }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { size: 9, "aria-hidden": "true" }),
                            issue.source
                          ] }),
                          issue.device && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "· ",
                            issue.device
                          ] }),
                          issue.timestamp && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                            "· ",
                            formatWhen(issue.timestamp)
                          ] }),
                          issue.count > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
                            padding: "0 4px",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-secondary)"
                          }, children: [
                            "×",
                            issue.count
                          ] })
                        ] }),
                        open && issue.detail && issue.detail !== issue.title && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
                          margin: "var(--space-2) 0 0",
                          padding: "var(--space-2)",
                          background: "var(--bg-code-block)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "var(--text-2xs)",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-secondary)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          userSelect: "text",
                          maxHeight: 180,
                          overflow: "auto"
                        }, children: issue.detail })
                      ] }),
                      caller && onOpenInEditor && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          onClick: () => onOpenInEditor(issue.caller.file, issue.caller.line, issue.caller.col),
                          title: `Open ${issue.caller.file}:${issue.caller.line} in editor`,
                          style: {
                            ...BTN_GHOST,
                            flexShrink: 0,
                            gap: 3,
                            color: "var(--text-link)",
                            maxWidth: 160
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FileCode2, { size: 10 }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: caller })
                          ]
                        }
                      )
                    ] })
                  },
                  issue.id
                );
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                borderTop: "1px solid var(--border-subtle)",
                background: "var(--bg-sidebar)",
                flexShrink: 0
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { ...SECTION_LABEL, fontSize: "var(--text-2xs)" }, children: [
                  filtered.length,
                  " of ",
                  issues.length,
                  " shown"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                  fontSize: "var(--text-2xs)",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-ui)"
                }, children: "Repeats are grouped" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onClose, style: { ...BTN_SECONDARY, height: 26 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }),
                  "Done"
                ] })
              ] })
            ]
          }
        )
      }
    ),
    document.body
  );
}
const TEMPLATE = `// ── React Native Spy SDK ─────────────────────────────────
// IMPORTANT: Paste this at the VERY TOP of your entry file (index.js or App.js),
// BEFORE any SignalR or other WebSocket library imports.
// This ensures all WebSocket traffic (including SignalR) is captured.
// Remove before shipping to production.

if (__DEV__) {
  ;(function () {
    const RNSPY_HOST = '__RNSPY_HOST__'
    const RNSPY_PORT = __RNSPY_PORT__
    const RNSPY_URL = 'ws://' + RNSPY_HOST + ':' + RNSPY_PORT

    // ── Device Identity ────────────────────────────
    let deviceId
    try {
      const DeviceInfo = require('react-native-device-info')
      deviceId = DeviceInfo.getUniqueIdSync()
    } catch {
      deviceId = 'rn-' + Math.random().toString(36).slice(2, 10)
    }

    let deviceName = 'React Native'
    let devicePlatform = 'unknown'
    try {
      const { Platform } = require('react-native')
      devicePlatform = Platform.OS || 'unknown'
      const DeviceInfo = require('react-native-device-info')
      deviceName = DeviceInfo.getDeviceNameSync?.() || DeviceInfo.getModel?.() || 'React Native'
    } catch {}

    // ── Storage Bridge (AsyncStorage + MMKV) ───────
    // Resolve AsyncStorage (async, single store) and track every MMKV
    // instance the app creates by wrapping the MMKV constructor. The SDK
    // runs at the top of the entry file, so the wrap is installed before
    // any 'new MMKV()' in app code — that's how instances are auto-detected.
    // Diagnostics travel with every snapshot so the desktop can show WHY a
    // backend is empty instead of silently rendering nothing.
    var storageDiag = {
      asyncResolved: false,
      mmkvResolved: false,
      mmkvError: null,
      notes: [],
    }

    var AsyncStorage = null
    try {
      var asMod = require('@react-native-async-storage/async-storage')
      AsyncStorage = (asMod && asMod.default) || asMod
      storageDiag.asyncResolved = !!(AsyncStorage && AsyncStorage.getAllKeys)
    } catch (e) {
      storageDiag.notes.push('AsyncStorage require failed: ' + ((e && e.message) || 'not installed'))
    }

    var mmkvInstances = []
    var mmkvChangeTimer = null
    var OrigMMKV = null
    var mmkvCreateFn = null
    var defaultMmkvOpened = false

    // WatermelonDB: capture the app's Database instance. It's a reactive SQLite
    // ORM, so unlike key-value stores we read whole tables of records. We can't
    // reliably enumerate a DB that was built before this snippet ran, so we (a)
    // wrap the Database constructor to catch new ones and (b) read a global
    // escape hatch the user can set: global.__rnspyWatermelonDB = database.
    var watermelonDB = null
    var watermelonQ = null // @nozbe/watermelondb Q helpers (skip/take) for paging
    var watermelonDiag = { resolved: false, error: null, notes: [] }

    // Build an MMKV instance through whichever API this app's build exposes:
    // the MMKV class (v2 / standard v3) or the createMMKV factory (builds
    // that export factory functions instead of a class). Same-id instances
    // share native storage, so either path reads the app's real data.
    function createMmkvInstance(id) {
      var wantId = id || 'mmkv.default'
      if (OrigMMKV) return new OrigMMKV({ id: wantId })
      if (mmkvCreateFn) {
        // Factory signature varies: try an object config, then positional id.
        try { return mmkvCreateFn({ id: wantId }) }
        catch (e) { return mmkvCreateFn(wantId) }
      }
      return null
    }

    // Register an MMKV instance for inspection (dedup by id) and subscribe to
    // its change events so the desktop gets a live push when the app writes.
    function trackMmkv(inst, id) {
      if (!inst) return inst
      try {
        inst.__rnspyId = id || 'mmkv.default'
        for (var j = 0; j < mmkvInstances.length; j++) {
          if ((mmkvInstances[j].__rnspyId || 'mmkv.default') === inst.__rnspyId) return inst
        }
        mmkvInstances.push(inst)
        // Push a fresh snapshot when the app mutates this store (debounced).
        if (inst.addOnValueChangedListener) {
          inst.addOnValueChangedListener(function () {
            if (mmkvChangeTimer) return
            mmkvChangeTimer = setTimeout(function () {
              mmkvChangeTimer = null
              sendSnapshot(null, { ok: true, source: 'mmkv-change' })
            }, 300)
          })
        }
      } catch {}
      return inst
    }

    // Wrap the MMKV constructor so any 'new MMKV({ id })' the app creates AFTER
    // this snippet runs is auto-detected (catches named instances too).
    // IMPORTANT: we do NOT construct any MMKV here. MMKV is a JSI/native module;
    // instantiating it at snippet-load time (before the RN runtime is ready) can
    // hard-crash natively — uncatchable by JS try/catch — which shows up as an
    // endless connect→crash→reconnect loop. Defer the default-instance open to
    // the first storage read (see ensureDefaultMmkv), by which point RN is up.
    try {
      var MMKVModule = require('react-native-mmkv')
      // Unwrap CommonJS/ESM interop (real module may sit under .default).
      var mmkvNs = MMKVModule && MMKVModule.default && (MMKVModule.default.MMKV || MMKVModule.default.createMMKV)
        ? MMKVModule.default
        : MMKVModule

      if (mmkvNs && typeof mmkvNs.MMKV === 'function') {
        // Standard: the MMKV class. Wrap the constructor so instances the app
        // creates AFTER this snippet are auto-detected too.
        OrigMMKV = mmkvNs.MMKV
        storageDiag.mmkvResolved = true
        var TrackedMMKV = function (config) {
          var inst = new OrigMMKV(config)
          return trackMmkv(inst, (config && config.id) || 'mmkv.default')
        }
        TrackedMMKV.prototype = OrigMMKV.prototype
        mmkvNs.MMKV = TrackedMMKV
      } else if (mmkvNs && typeof mmkvNs.createMMKV === 'function') {
        // Factory-only build: no class, just createMMKV(). We can still open
        // instances by id; the returned object has the same read/write methods.
        mmkvCreateFn = mmkvNs.createMMKV
        storageDiag.mmkvResolved = true
        storageDiag.notes.push('MMKV resolved via createMMKV factory (no class export)')
      } else {
        // Resolved, but neither a class nor a factory — report the actual shape.
        var shape = mmkvNs ? Object.keys(mmkvNs).slice(0, 10).join(', ') : 'null'
        storageDiag.mmkvError = 'module resolved but no MMKV class or createMMKV (keys: ' + shape + ')'
        storageDiag.notes.push(storageDiag.mmkvError)
      }
    } catch (e) {
      storageDiag.mmkvError = (e && e.message) || 'require failed'
      storageDiag.notes.push('react-native-mmkv require failed: ' + storageDiag.mmkvError)
    }

    // Lazily open the DEFAULT MMKV instance on first read. Same-id instances
    // share the same native storage, so this sees the exact same data as the
    // app's own 'new MMKV()' even if the app created it before this snippet ran
    // (the common 'export const storage = new MMKV()' at module load).
    function ensureDefaultMmkv() {
      if (defaultMmkvOpened || (!OrigMMKV && !mmkvCreateFn)) return
      defaultMmkvOpened = true
      try {
        var inst = createMmkvInstance('mmkv.default')
        if (inst) trackMmkv(inst, 'mmkv.default')
      } catch (e) {
        storageDiag.notes.push('Opening default MMKV failed: ' + ((e && e.message) || 'error'))
      }
    }

    // ── WatermelonDB Bridge ─────────────────────────
    // Wrap @nozbe/watermelondb's Database constructor so any DB the app builds
    // AFTER this snippet is captured. A DB built earlier won't be caught, so the
    // user can expose it via global.__rnspyWatermelonDB — checked on every read.
    try {
      var WMDBModule = require('@nozbe/watermelondb')
      var DatabaseClass = WMDBModule && (WMDBModule.Database || (WMDBModule.default && WMDBModule.default.Database))
      // Query helpers (Q.skip / Q.take) enable efficient server-side paging.
      watermelonQ = (WMDBModule && (WMDBModule.Q || (WMDBModule.default && WMDBModule.default.Q))) || null
      if (typeof DatabaseClass === 'function') {
        watermelonDiag.resolved = true
        // Proxy the constructor so 'new Database(...)' is captured without
        // altering behavior (construct trap forwards to the real class).
        var TrackedDatabase = new Proxy(DatabaseClass, {
          construct: function (target, args, newTarget) {
            var db = Reflect.construct(target, args, newTarget)
            try { if (!watermelonDB) watermelonDB = db } catch {}
            return db
          },
        })
        if (WMDBModule.Database) WMDBModule.Database = TrackedDatabase
        if (WMDBModule.default && WMDBModule.default.Database) WMDBModule.default.Database = TrackedDatabase
      } else {
        watermelonDiag.notes.push('@nozbe/watermelondb resolved but no Database export')
      }
    } catch (e) {
      watermelonDiag.error = (e && e.message) || 'require failed'
    }

    function resolveWatermelonDB() {
      // Prefer an explicitly exposed instance; fall back to the captured one.
      try {
        if (global.__rnspyWatermelonDB) return global.__rnspyWatermelonDB
      } catch {}
      return watermelonDB
    }

    // Serialize a WatermelonDB record's user fields (its _raw column bag),
    // skipping internal sync bookkeeping columns.
    function serializeWmRecord(rec) {
      var raw = (rec && rec._raw) || {}
      var out = {}
      for (var k in raw) {
        if (!Object.prototype.hasOwnProperty.call(raw, k)) continue
        if (k === '_status' || k === '_changed') continue
        var v = raw[k]
        out[k] = (v !== null && typeof v === 'object') ? JSON.stringify(v) : v
      }
      return out
    }

    // Resolve a Collection by table name across Watermelon versions.
    function getWmCollection(db, name) {
      if (db.get) return db.get(name)
      if (db.collections && db.collections.get) return db.collections.get(name)
      return null
    }

    // Enumerate table names from the collections map, falling back to schema.
    function listWmTableNames(db) {
      var names = []
      try {
        var collectionsMap = db.collections && db.collections.map
        if (collectionsMap && typeof collectionsMap.forEach === 'function') {
          collectionsMap.forEach(function (_c, name) { names.push(name) })
        } else if (db.schema && db.schema.tables) {
          for (var t in db.schema.tables) {
            if (Object.prototype.hasOwnProperty.call(db.schema.tables, t)) names.push(t)
          }
        }
      } catch (e) {
        watermelonDiag.notes.push('Enumerating tables failed: ' + ((e && e.message) || 'error'))
      }
      return names
    }

    // Column names for a table, taken from its schema definition (order-stable,
    // available without fetching any rows). '_status'/'_changed' are excluded.
    function wmSchemaColumns(db, name) {
      var cols = []
      try {
        var table = db.schema && db.schema.tables && db.schema.tables[name]
        var colMap = table && table.columns
        if (colMap) {
          if (typeof colMap.forEach === 'function') {
            colMap.forEach(function (_def, key) { cols.push(key) })
          } else {
            for (var k in colMap) {
              if (Object.prototype.hasOwnProperty.call(colMap, k)) cols.push(k)
            }
          }
        }
      } catch {}
      return cols
    }

    // Table metadata only: row count + columns, NO rows. Cheap; sent up front so
    // the desktop can render the table list and lazy-load rows in pages.
    function listWatermelonTables() {
      var db = resolveWatermelonDB()
      if (!db) return Promise.resolve(null)
      var names = listWmTableNames(db)
      if (!names.length) return Promise.resolve([])

      var tasks = names.map(function (name) {
        try {
          var collection = getWmCollection(db, name)
          if (!collection) return Promise.resolve({ table: name, columns: [], rowCount: 0, error: 'collection-not-found' })
          return collection.query().fetchCount().then(function (count) {
            return { table: name, columns: wmSchemaColumns(db, name), rowCount: count || 0 }
          }).catch(function (err) {
            return { table: name, columns: wmSchemaColumns(db, name), rowCount: 0, error: (err && err.message) || 'count-failed' }
          })
        } catch (e) {
          return Promise.resolve({ table: name, columns: [], rowCount: 0, error: (e && e.message) || 'error' })
        }
      })
      return Promise.all(tasks)
    }

    // Fetch one page of rows for a table. Uses Q.skip/Q.take for server-side
    // paging when available; otherwise fetches all and slices (still correct,
    // just less efficient on very large tables).
    var WM_PAGE_SIZE = 50
    function fetchWatermelonPage(name, offset, limit) {
      var db = resolveWatermelonDB()
      if (!db) return Promise.resolve({ table: name, offset: offset, rows: [], total: 0, error: 'no-db' })
      var off = Math.max(0, offset | 0)
      var lim = Math.max(1, (limit | 0) || WM_PAGE_SIZE)

      var collection
      try {
        collection = getWmCollection(db, name)
        if (!collection) return Promise.resolve({ table: name, offset: off, rows: [], total: 0, error: 'collection-not-found' })
      } catch (e) {
        return Promise.resolve({ table: name, offset: off, rows: [], total: 0, error: (e && e.message) || 'error' })
      }

      // watermelonQ is the module's Q helpers; guard because older builds lack skip/take.
      var canPage = watermelonQ && typeof watermelonQ.skip === 'function' && typeof watermelonQ.take === 'function'
      var countP = collection.query().fetchCount().catch(function () { return 0 })
      var rowsP
      try {
        rowsP = canPage
          ? collection.query(watermelonQ.skip(off), watermelonQ.take(lim)).fetch()
          : collection.query().fetch().then(function (all) { return (all || []).slice(off, off + lim) })
      } catch (e) {
        rowsP = Promise.reject(e)
      }

      return Promise.all([rowsP, countP]).then(function (res) {
        var records = res[0] || []
        var total = res[1] || 0
        var rows = records.map(function (r) { return { id: r.id, fields: serializeWmRecord(r) } })
        return { table: name, offset: off, limit: lim, rows: rows, total: total, paged: canPage }
      }).catch(function (err) {
        return { table: name, offset: off, rows: [], total: 0, error: (err && err.message) || 'query-failed' }
      })
    }

    function wmDiag() {
      return {
        resolved: watermelonDiag.resolved,
        error: watermelonDiag.error,
        hasInstance: !!resolveWatermelonDB(),
        notes: watermelonDiag.notes.slice(-6),
      }
    }

    // Send table list (metadata only).
    function sendWatermelonSnapshot(reqId) {
      listWatermelonTables().then(function (tables) {
        send({
          kind: 'watermelon-snapshot', reqId: reqId,
          available: !!resolveWatermelonDB(),
          tables: tables || [],
          diag: wmDiag(),
        })
      }).catch(function (err) {
        send({
          kind: 'watermelon-snapshot', reqId: reqId, available: false, tables: [],
          error: (err && err.message) || 'collect-failed', diag: wmDiag(),
        })
      })
    }

    // Send one page of rows for a table.
    function sendWatermelonPage(reqId, table, offset, limit) {
      fetchWatermelonPage(table, offset, limit).then(function (page) {
        send({ kind: 'watermelon-page', reqId: reqId, available: !!resolveWatermelonDB(), page: page })
      }).catch(function (err) {
        send({
          kind: 'watermelon-page', reqId: reqId, available: false,
          page: { table: table, offset: offset, rows: [], total: 0, error: (err && err.message) || 'page-failed' },
        })
      })
    }

    // ── Navigation Bridge (React Navigation) ────────
    // Two wraps, both read-only:
    //   1. NavigationContainer gains an onStateChange (chaining the app's own)
    //      so every route change is reported as it happens.
    //   2. Each navigator's Navigator component has its children inspected to
    //      learn which component renders which route name. That component name
    //      is what lets the desktop app find the screen's source file.
    // Expo Router builds its own container internally, so it is not covered.
    var navStack = null      // focused path, root first
    var navPrevRoute = null
    var navScreens = {}      // routeName -> componentName
    var navRegistryTimer = null
    var navDiag = { resolved: false, error: null, notes: [] }

    function serializeNavParams(params) {
      if (!params || typeof params !== 'object') return null
      try {
        var json = JSON.stringify(params)
        if (json === undefined) return null
        if (json.length > 4000) return { __rnspyTruncated: true, bytes: json.length }
        return JSON.parse(json)
      } catch {
        return { __rnspyUnserializable: true }
      }
    }

    // Walk routes[index] down through nested navigator state, producing the
    // focused path: [rootRoute, ..., focusedRoute].
    function flattenNavState(state) {
      var out = []
      var node = state
      var guard = 0
      while (node && node.routes && node.routes.length && guard++ < 50) {
        var idx = typeof node.index === 'number' ? node.index : node.routes.length - 1
        var route = node.routes[idx]
        if (!route) break
        out.push({
          name: route.name || 'unknown',
          key: route.key || null,
          params: serializeNavParams(route.params),
          navigatorType: node.type || null,
        })
        node = route.state
      }
      return out
    }

    function sendNavigationState(reqId) {
      var stack = navStack || []
      var focused = stack.length ? stack[stack.length - 1] : null
      send({
        kind: 'navigation',
        reqId: reqId,
        available: navDiag.resolved,
        stack: stack,
        routeName: focused ? focused.name : null,
        prevRouteName: navPrevRoute,
        screens: navScreens,
        diag: { resolved: navDiag.resolved, error: navDiag.error, notes: navDiag.notes.slice(-6) },
      })
    }

    function handleNavState(state, force) {
      try {
        var next = flattenNavState(state)
        var focused = next.length ? next[next.length - 1] : null
        var prev = navStack && navStack.length ? navStack[navStack.length - 1] : null
        // Report only real changes: a different route, or the same route with
        // different params. Redundant onStateChange calls are common.
        var changed = force || !prev || !focused ||
          prev.key !== focused.key || prev.name !== focused.name ||
          JSON.stringify(prev.params) !== JSON.stringify(focused.params)
        navPrevRoute = prev ? prev.name : null
        navStack = next
        if (changed) sendNavigationState(null)
      } catch (e) {
        navDiag.notes.push('State change handler failed: ' + ((e && e.message) || 'error'))
      }
    }

    // Screens are recorded during render, so the send is deferred out of the
    // render phase and coalesced across every navigator that mounts at once.
    function scheduleNavRegistry() {
      if (navRegistryTimer) return
      navRegistryTimer = setTimeout(function () {
        navRegistryTimer = null
        send({ kind: 'navigation-registry', screens: navScreens })
      }, 250)
    }

    // Interception happens at the ELEMENT FACTORY, not on the module exports.
    //
    // Reassigning NavMod.NavigationContainer cannot work in practice:
    //   - React Navigation 7 ships ESM-only, so its exports are immutable
    //     bindings rather than writable CommonJS properties.
    //   - Apps import it by name ("import { NavigationContainer } from ..."),
    //     and Metro inlines named imports, so the JSX call site holds a direct
    //     reference that a later export assignment never reaches.
    // Every JSX element, whatever the import style, goes through createElement
    // (classic transform) or jsx/jsxs (automatic transform), so patching those
    // catches the container and every Screen no matter how they were imported.
    var navContainerNode = null

    function injectContainerProps(props) {
      var userOnStateChange = props.onStateChange
      var userOnReady = props.onReady
      var userRef = props.ref

      var nextProps = Object.assign({}, props)

      // Our own handle on the container: onStateChange does not fire for the
      // initial route, so the first state has to be read on ready.
      nextProps.ref = function (node) {
        navContainerNode = node
        if (typeof userRef === 'function') userRef(node)
        else if (userRef && typeof userRef === 'object') userRef.current = node
      }

      nextProps.onStateChange = function (state) {
        handleNavState(state, false)
        if (typeof userOnStateChange === 'function') {
          try { userOnStateChange(state) } catch {}
        }
      }

      nextProps.onReady = function () {
        try {
          if (navContainerNode && navContainerNode.getRootState) {
            handleNavState(navContainerNode.getRootState(), true)
          }
        } catch (e) {
          navDiag.notes.push('Reading initial state failed: ' + ((e && e.message) || 'error'))
        }
        if (typeof userOnReady === 'function') {
          try { userOnReady() } catch {}
        }
      }

      return nextProps
    }

    function isNavContainerType(type) {
      if (!type) return false
      if (navContainerType && type === navContainerType) return true
      // Identity can differ when the tree holds more than one copy of the
      // package, so fall back to the component's own name.
      var n = type.displayName || type.name
      return n === 'NavigationContainer'
    }

    // A Screen element is the one place a route name meets the component that
    // renders it. Recording it here (rather than walking a Navigator's
    // children) works for every navigator type without wrapping any factory.
    function maybeRecordScreen(props) {
      var name = props.name
      if (!name || typeof name !== 'string') return
      var comp = props.component
      if (!comp) return
      var t = typeof comp
      if (t !== 'function' && t !== 'object') return
      var compName = comp.displayName || comp.name || null
      if (navScreens[name] === (compName || name)) return
      navScreens[name] = compName || name
      scheduleNavRegistry()
    }

    // createElement runs for every element in the tree, so the fast path here
    // must stay two cheap property reads.
    function patchElementFactory(host, key) {
      var orig = host && host[key]
      if (typeof orig !== 'function' || orig.__rnspyNavPatched) return false
      var patched = function (type, props) {
        if (props) {
          try {
            if (isNavContainerType(type)) {
              var args = Array.prototype.slice.call(arguments)
              args[1] = injectContainerProps(props)
              return orig.apply(this, args)
            }
            maybeRecordScreen(props)
          } catch {}
        }
        return orig.apply(this, arguments)
      }
      patched.__rnspyNavPatched = true
      // Copy statics (jsx runtimes and React both carry extra properties).
      try {
        for (var k in orig) {
          if (Object.prototype.hasOwnProperty.call(orig, k)) patched[k] = orig[k]
        }
      } catch {}
      try {
        host[key] = patched
        return host[key] === patched
      } catch (e) {
        navDiag.notes.push('Patching ' + key + ' failed: ' + ((e && e.message) || 'read-only'))
        return false
      }
    }

    var navContainerType = null
    try {
      // Resolving the package is optional: the name-based fallback in
      // isNavContainerType still identifies the container without it.
      try {
        var NavMod = require('@react-navigation/native')
        navContainerType = (NavMod && NavMod.NavigationContainer)
          || (NavMod && NavMod.default && NavMod.default.NavigationContainer)
          || null
      } catch (e) {
        navDiag.notes.push('@react-navigation/native require failed: ' + ((e && e.message) || 'not installed'))
      }

      var patchedAny = false
      try { patchedAny = patchElementFactory(require('react'), 'createElement') || patchedAny } catch {}
      // Automatic JSX transform (RN 0.71+ default). Both runtimes are patched
      // because one app can contain modules built with either transform.
      try {
        var JsxRuntime = require('react/jsx-runtime')
        patchedAny = patchElementFactory(JsxRuntime, 'jsx') || patchedAny
        patchedAny = patchElementFactory(JsxRuntime, 'jsxs') || patchedAny
      } catch {}
      try {
        var JsxDevRuntime = require('react/jsx-dev-runtime')
        patchedAny = patchElementFactory(JsxDevRuntime, 'jsxDEV') || patchedAny
      } catch {}

      if (patchedAny) {
        navDiag.resolved = true
      } else {
        navDiag.error = 'could not patch any JSX element factory'
        navDiag.notes.push(navDiag.error)
      }
    } catch (e) {
      navDiag.error = (e && e.message) || 'navigation bridge failed'
      navDiag.notes.push('Navigation bridge failed: ' + navDiag.error)
    }

    function readMmkvValue(inst, k) {
      try {
        var s = inst.getString(k)
        if (s !== undefined) return { value: s, type: 'string' }
      } catch {}
      try {
        var n = inst.getNumber(k)
        if (n !== undefined) return { value: n, type: 'number' }
      } catch {}
      try {
        var b = inst.getBoolean(k)
        if (b !== undefined) return { value: b, type: 'boolean' }
      } catch {}
      return { value: '', type: 'string' }
    }

    function collectStorage() {
      var backends = []

      // Open the default MMKV store lazily (safe now: runtime is ready).
      ensureDefaultMmkv()

      // MMKV instances (synchronous)
      var seenIds = {}
      mmkvInstances.forEach(function (inst) {
        try {
          var id = inst.__rnspyId || 'mmkv.default'
          if (seenIds[id]) return
          seenIds[id] = true
          var keys = inst.getAllKeys() || []
          var entries = keys.map(function (k) {
            var r = readMmkvValue(inst, k)
            return { key: k, value: r.value, type: r.type }
          })
          backends.push({ backend: 'mmkv', instanceId: id, label: 'MMKV · ' + id, entries: entries })
        } catch (e) {
          storageDiag.notes.push('Reading MMKV "' + (inst.__rnspyId || '?') + '" failed: ' + ((e && e.message) || 'error'))
        }
      })

      // AsyncStorage (single async store)
      if (AsyncStorage && AsyncStorage.getAllKeys) {
        return AsyncStorage.getAllKeys().then(function (keys) {
          return AsyncStorage.multiGet(keys || []).then(function (pairs) {
            var entries = (pairs || []).map(function (p) {
              return { key: p[0], value: p[1] == null ? null : p[1], type: 'string' }
            })
            backends.unshift({ backend: 'async', instanceId: 'AsyncStorage', label: 'AsyncStorage', entries: entries })
            return backends
          })
        }).catch(function () { return backends })
      }
      return Promise.resolve(backends)
    }

    function coerceMmkv(value, type) {
      if (type === 'number') { var n = Number(value); return isNaN(n) ? 0 : n }
      if (type === 'boolean') return value === true || value === 'true'
      return value == null ? '' : String(value)
    }

    function applyStorageMutation(cmd) {
      // cmd: { command, backend, instanceId, key, value, type }
      if (cmd.backend === 'async') {
        if (!AsyncStorage) return Promise.reject(new Error('AsyncStorage not installed'))
        if (cmd.command === 'storage-remove') return AsyncStorage.removeItem(cmd.key)
        return AsyncStorage.setItem(cmd.key, cmd.value == null ? '' : String(cmd.value))
      }
      if (cmd.backend === 'mmkv') {
        var inst = null
        for (var i = 0; i < mmkvInstances.length; i++) {
          if ((mmkvInstances[i].__rnspyId || 'mmkv.default') === cmd.instanceId) { inst = mmkvInstances[i]; break }
        }
        if (!inst) return Promise.reject(new Error('MMKV instance not found'))
        if (cmd.command === 'storage-remove') { inst.delete(cmd.key); return Promise.resolve() }
        inst.set(cmd.key, coerceMmkv(cmd.value, cmd.type || 'string'))
        return Promise.resolve()
      }
      return Promise.reject(new Error('unknown backend'))
    }

    // Open a named MMKV instance on demand. There is no MMKV API to enumerate
    // instances, so if the app keeps its data in 'new MMKV({ id: "x" })' created
    // before this snippet ran, the user can name that id in the UI and we open
    // it here (same-id instances share native storage, so this reveals its data).
    function openMmkvInstanceById(id) {
      if (!OrigMMKV && !mmkvCreateFn) return { ok: false, error: 'react-native-mmkv not resolved' }
      var wantId = id || 'mmkv.default'
      for (var i = 0; i < mmkvInstances.length; i++) {
        if ((mmkvInstances[i].__rnspyId || 'mmkv.default') === wantId) return { ok: true, already: true }
      }
      try {
        var inst = createMmkvInstance(wantId)
        if (!inst) return { ok: false, error: 'could not create MMKV instance' }
        trackMmkv(inst, wantId)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: (e && e.message) || 'open-failed' }
      }
    }

    function buildDiag() {
      // Snapshot the diagnostics so the desktop can explain empty results.
      return {
        asyncResolved: storageDiag.asyncResolved,
        mmkvResolved: storageDiag.mmkvResolved,
        mmkvError: storageDiag.mmkvError,
        mmkvInstanceCount: mmkvInstances.length,
        notes: storageDiag.notes.slice(-8),
      }
    }

    function sendSnapshot(reqId, mutation) {
      // Reset transient per-read notes (keep resolution errors, which are sticky).
      storageDiag.notes = storageDiag.notes.filter(function (n) {
        return n.indexOf('require failed') !== -1
      })
      collectStorage().then(function (backends) {
        send({ kind: 'storage-snapshot', reqId: reqId, backends: backends, mutation: mutation || null, diag: buildDiag() })
      }).catch(function (err) {
        send({ kind: 'storage-snapshot', reqId: reqId, backends: [], error: (err && err.message) || 'collect-failed', diag: buildDiag() })
      })
    }

    // ── WebSocket Connection ────────────────────────
    let ws = null
    let seq = 0
    const queue = []
    const MAX_QUEUE = 500

    function send(msg) {
      msg.deviceId = deviceId
      msg.timestamp = Date.now()
      msg.id = msg.id || ++seq
      if (ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify(msg)); return } catch {}
      }
      if (queue.length < MAX_QUEUE) queue.push(msg)
    }

    function flush() {
      while (queue.length && ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify(queue.shift())) } catch { break }
      }
    }

    function connect() {
      try {
        const OrigWS = global.__rnspyOrigWS || global.WebSocket
        ws = new OrigWS(RNSPY_URL)
        ws.onopen = function () {
          send({ kind: 'hello', name: deviceName, platform: devicePlatform })
          flush()
        }
        ws.onmessage = function (e) {
          try {
            var msg = JSON.parse(e.data)
            if (msg && msg.kind === 'command') {
              if (msg.command === 'reload') {
                // Try RN DevSettings fast-refresh first, then full reload
                try {
                  var DevSettings = require('react-native/Libraries/Utilities/DevSettings')
                  if (DevSettings && DevSettings.reload) { DevSettings.reload(); return }
                } catch {}
                try {
                  var { DevSettings: DS } = require('react-native')
                  if (DS && DS.reload) { DS.reload(); return }
                } catch {}
              }
              if (msg.command === 'storage-read') {
                sendSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'storage-open-instance') {
                // Open a named MMKV instance the user typed in. Same-id
                // instances share native storage, so this reveals data from a
                // named store the app created before this snippet ran.
                openMmkvInstanceById(msg.instanceId)
                sendSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'navigation-read') {
                sendNavigationState(msg.reqId)
                return
              }
              if (msg.command === 'watermelon-read') {
                sendWatermelonSnapshot(msg.reqId)
                return
              }
              if (msg.command === 'watermelon-page') {
                sendWatermelonPage(msg.reqId, msg.table, msg.offset, msg.limit)
                return
              }
              if (msg.command === 'storage-set' || msg.command === 'storage-remove') {
                applyStorageMutation(msg)
                  .then(function () { sendSnapshot(msg.reqId, { ok: true, key: msg.key, command: msg.command }) })
                  .catch(function (err) {
                    send({ kind: 'storage-snapshot', reqId: msg.reqId, backends: [],
                           mutation: { ok: false, key: msg.key, command: msg.command, error: (err && err.message) || 'failed' } })
                  })
                return
              }
            }
          } catch {}
        }
        ws.onclose = function () { setTimeout(connect, 2000) }
        ws.onerror = function () {}
      } catch { setTimeout(connect, 2000) }
    }
    connect()

    // ── Patch console.* ────────────────────────────
    // Captures caller file:line:col from Error().stack.
    // Skips 2 internal frames: (1) new Error() itself, (2) the patched console wrapper.
    var SDK_FRAMES_TO_SKIP = 2

    function parseCallerFromStack(stack) {
      if (!stack) return null
      var lines = stack.split('\\n')
      var frameIdx = 0
      for (var i = 1; i < lines.length; i++) {
        var line = lines[i]
        var m = line.match(/(?:at\\s+(?:.*?\\s+)?\\(?|^\\s*)([^()\\s]+?):(\\d+):(\\d+)/)
        if (!m) continue
        frameIdx++
        if (frameIdx <= SDK_FRAMES_TO_SKIP) continue
        var filePath = m[1]
        filePath = filePath.replace(/^https?:\\/\\/[^/]+\\//, '')
        return { file: filePath, line: parseInt(m[2], 10), col: parseInt(m[3], 10) }
      }
      return null
    }

    function stripSdkFrames(stack) {
      if (!stack) return stack
      var lines = stack.split('\\n')
      var result = [lines[0]]
      var frameIdx = 0
      for (var i = 1; i < lines.length; i++) {
        var hasLoc = /:d+:d+/.test(lines[i])
        if (hasLoc) {
          frameIdx++
          if (frameIdx <= SDK_FRAMES_TO_SKIP) continue
        }
        result.push(lines[i])
      }
      return result.join('\\n')
    }

    var levels = ['log', 'info', 'warn', 'error', 'debug']
    levels.forEach(function (level) {
      var orig = console[level]
      console[level] = function () {
        orig.apply(console, arguments)
        var args = []
        for (var i = 0; i < arguments.length; i++) {
          try {
            var a = arguments[i]
            if (a instanceof Error) args.push({ message: a.message, stack: a.stack })
            else if (typeof a === 'object' && a !== null) args.push(JSON.parse(JSON.stringify(a)))
            else args.push(a)
          } catch { args.push('[unserializable]') }
        }
        var caller = null
        var rawStack = null
        try {
          var fullStack = new Error().stack
          caller = parseCallerFromStack(fullStack)
          rawStack = stripSdkFrames(fullStack)
        } catch {}
        send({ kind: 'console', level: level, args: args, caller: caller, stack: rawStack })
      }
    })

    // ── Fetch De-duplication ────────────────────────
    var pendingFetches = new Map()
    function markFetch(url, method) {
      var key = (method || 'GET') + ' ' + url
      pendingFetches.set(key, Date.now())
    }
    function claimFetch(url, method) {
      var key = (method || 'GET') + ' ' + url
      var ts = pendingFetches.get(key)
      if (ts && Date.now() - ts < 5000) { pendingFetches.delete(key); return true }
      return false
    }

    // ── Patch fetch ────────────────────────────────
    var origFetch = global.fetch
    global.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url) || ''
      var method = (init && init.method) || (typeof input !== 'string' && input && input.method) || 'GET'
      var id = ++seq
      var startTime = Date.now()
      markFetch(url, method)

      send({ kind: 'network-start', id: id, method: method, url: url, startTime: startTime,
             requestHeaders: (init && init.headers) || {},
             requestBody: init && init.body })

      return origFetch.apply(global, arguments).then(function (response) {
        // The fetch promise resolves once response HEADERS are available, before
        // the body streams in — so this is a real time-to-first-byte, and the
        // remainder is content download. Those two phases drive the waterfall.
        var ttfb = Date.now() - startTime
        var clone = response.clone()
        var headers = {}
        try { clone.headers.forEach(function (v, k) { headers[k] = v }) } catch {}

        return clone.text().then(function (body) {
          send({
            kind: 'network', id: id, method: method, url: url,
            status: response.status, responseHeaders: headers,
            responseBody: body, size: body.length,
            ttfb: ttfb,
            duration: Date.now() - startTime, startTime: startTime,
          })
          return response
        }).catch(function () { return response })
      }).catch(function (err) {
        send({
          kind: 'network', id: id, method: method, url: url,
          status: 0, error: err.message || 'fetch-failed',
          duration: Date.now() - startTime, startTime: startTime,
        })
        throw err
      })
    }

    // ── Patch XMLHttpRequest ────────────────────────
    var OrigXHR = global.XMLHttpRequest
    function PatchedXHR() {
      var xhr = new OrigXHR()
      var meta = { id: ++seq, method: 'GET', url: '', headers: {}, startTime: 0, ttfb: null }

      var origOpen = xhr.open
      xhr.open = function (method, url) {
        meta.method = method; meta.url = url
        return origOpen.apply(xhr, arguments)
      }

      var origSetHeader = xhr.setRequestHeader
      xhr.setRequestHeader = function (k, v) {
        meta.headers[k] = v
        return origSetHeader.apply(xhr, arguments)
      }

      var origSend = xhr.send
      xhr.send = function (body) {
        if (claimFetch(meta.url, meta.method)) return origSend.apply(xhr, arguments)
        meta.startTime = Date.now()
        send({ kind: 'network-start', id: meta.id, method: meta.method, url: meta.url,
               startTime: meta.startTime, requestHeaders: meta.headers, requestBody: body })

        // HEADERS_RECEIVED (readyState 2) is a real time-to-first-byte marker.
        // Captured here so the desktop waterfall can split wait vs download
        // instead of drawing one undifferentiated bar.
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState === 2 && meta.ttfb == null) {
            meta.ttfb = Date.now() - meta.startTime
          }
        })

        xhr.addEventListener('loadend', function () {
          var respHeaders = {}
          try {
            var raw = xhr.getAllResponseHeaders() || ''
            raw.split('\\r\\n').forEach(function (line) {
              var idx = line.indexOf(':')
              if (idx > 0) respHeaders[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
            })
          } catch {}
          var respBody = ''
          var respSize = 0
          var rt = xhr.responseType
          if (!rt || rt === '' || rt === 'text') {
            try { respBody = xhr.responseText || ''; respSize = respBody.length } catch {}
          } else if (rt === 'json') {
            try { respBody = JSON.stringify(xhr.response); respSize = respBody.length } catch {}
          } else if (rt === 'arraybuffer' && xhr.response) {
            respSize = xhr.response.byteLength || 0
            respBody = '[ArrayBuffer ' + respSize + ' bytes]'
          } else if (rt === 'blob' && xhr.response) {
            respSize = xhr.response.size || 0
            respBody = '[Blob ' + respSize + ' bytes, type=' + (xhr.response.type || 'unknown') + ']'
          } else {
            respBody = '[' + (rt || 'unknown') + ' response]'
          }
          send({
            kind: 'network', id: meta.id, method: meta.method, url: meta.url,
            status: xhr.status, responseHeaders: respHeaders,
            responseBody: respBody, size: respSize,
            ttfb: meta.ttfb,
            duration: Date.now() - meta.startTime, startTime: meta.startTime,
          })
        })
        return origSend.apply(xhr, arguments)
      }
      return xhr
    }
    PatchedXHR.prototype = OrigXHR.prototype
    PatchedXHR.UNSENT = 0; PatchedXHR.OPENED = 1
    PatchedXHR.HEADERS_RECEIVED = 2; PatchedXHR.LOADING = 3; PatchedXHR.DONE = 4
    global.XMLHttpRequest = PatchedXHR

    // ── Patch WebSocket (SignalR-compatible) ────────────────────────────
    // Key constraints:
    // 1. Forward ALL constructor args (url, protocols, options) for SignalR auth.
    // 2. Do NOT mutate OrigWebSocket.prototype (shared object) — causes loops.
    // 3. instanceof WebSocket must pass — SignalR checks this.
    // 4. Do not break native host-object property accessors (readyState, url).
    // Uses Symbol.hasInstance so real OrigWebSocket instances pass instanceof.
    var OrigWebSocket = global.WebSocket
    global.__rnspyOrigWS = OrigWebSocket

    // Track if we're inside our own connect() to prevent re-entry
    var insideSpyConnect = false

    function createSocket(url, protocols, options) {
      if (options != null) return new OrigWebSocket(url, protocols, options)
      if (protocols != null) return new OrigWebSocket(url, protocols)
      return new OrigWebSocket(url)
    }

    function interceptSocket(socket, url, protocols) {
      var wsId = ++seq

      send({ kind: 'ws-open', wsId: wsId, url: url, protocols: protocols,
             startTime: Date.now() })

      var origWsSend = socket.send.bind(socket)
      socket.send = function (data) {
        send({ kind: 'ws-frame', wsId: wsId, dir: 'send', data: data,
               size: typeof data === 'string' ? data.length : (data && data.byteLength) || 0 })
        return origWsSend(data)
      }

      socket.addEventListener('message', function (e) {
        var d = e.data
        var sz = typeof d === 'string' ? d.length : (d && d.byteLength) || 0
        send({ kind: 'ws-frame', wsId: wsId, dir: 'recv', data: d, size: sz })
      })

      socket.addEventListener('close', function (e) {
        send({ kind: 'ws-close', wsId: wsId, code: e.code, reason: e.reason,
               wasClean: e.wasClean, endTime: Date.now() })
      })

      socket.addEventListener('error', function () {
        send({ kind: 'ws-error', wsId: wsId, message: 'WebSocket error' })
      })

      return socket
    }

    // The patched constructor — returns a genuine OrigWebSocket instance
    var PatchedWebSocket = function WebSocket(url, protocols, options) {
      var socket = createSocket(url, protocols, options)

      // Skip interception for: our own spy connection, or re-entrant calls
      if (insideSpyConnect) return socket
      if (typeof url === 'string' && url.indexOf(RNSPY_HOST + ':' + RNSPY_PORT) !== -1) return socket

      return interceptSocket(socket, url, protocols)
    }

    // DO NOT assign PatchedWebSocket.prototype = OrigWebSocket.prototype
    // That would let .constructor assignment corrupt the original.
    // Instead, create a NEW prototype object that inherits from OrigWebSocket.prototype
    PatchedWebSocket.prototype = Object.create(OrigWebSocket.prototype)
    // Don't set .constructor — leave it as OrigWebSocket so nothing breaks

    // Static constants
    PatchedWebSocket.CONNECTING = 0
    PatchedWebSocket.OPEN = 1
    PatchedWebSocket.CLOSING = 2
    PatchedWebSocket.CLOSED = 3

    // Make instanceof PatchedWebSocket return true for OrigWebSocket instances
    Object.defineProperty(PatchedWebSocket, Symbol.hasInstance, {
      value: function (instance) {
        return instance instanceof OrigWebSocket
      }
    })

    global.WebSocket = PatchedWebSocket

    // Fix our own connect() to use OrigWebSocket directly and mark re-entry
    var origConnect = connect
    connect = function () {
      insideSpyConnect = true
      try { origConnect() } finally { insideSpyConnect = false }
    }

    // ── SignalR Fallback: patch HubConnectionBuilder.withUrl ──
    // In RN, SignalR resolves WebSocket constructor via options.WebSocket.
    // If SignalR was loaded before this SDK, it may have cached OrigWebSocket.
    // This ensures PatchedWebSocket is injected into the connection options.
    try {
      var origRequire = typeof require !== 'undefined' && require
      if (origRequire) {
        var patchSignalRModule = function (signalr) {
          if (!signalr || !signalr.HubConnectionBuilder) return signalr
          var origWithUrl = signalr.HubConnectionBuilder.prototype.withUrl
          signalr.HubConnectionBuilder.prototype.withUrl = function (url, opts) {
            if (typeof opts === 'object' && opts !== null) {
              opts.WebSocket = opts.WebSocket || PatchedWebSocket
            } else if (typeof opts === 'number' || opts === undefined) {
              opts = { transport: opts, WebSocket: PatchedWebSocket }
            }
            return origWithUrl.call(this, url, opts)
          }
          return signalr
        }

        try { patchSignalRModule(origRequire('@microsoft/signalr')) } catch {}
        try { patchSignalRModule(origRequire('@react-native-community/signalr')) } catch {}
      }
    } catch {}
  })()
}
`;
function buildRnClient({ host = "localhost", port = 8097 } = {}) {
  return TEMPLATE.replace("__RNSPY_HOST__", host).replace("__RNSPY_PORT__", String(port));
}
const MAX_CONSOLE_LOGS = 2e3;
const MAX_NETWORK_REQUESTS = 2e3;
const MAX_SERVER_LOGS = 500;
const MAX_WS_FRAMES = 2e3;
const MAX_NAV_HISTORY = 500;
const DEFAULT_PORT = 8097;
const PORT_STORAGE_KEY = "rnspyDevtoolsPort";
const RECORDS_STORAGE_KEY = "rnspyDevtoolsRecords";
const HIDDEN_RULES_KEY = "rnspyDevtoolsHiddenRules";
const PROJECT_ROOT_KEY = "rnspyDevtoolsProjectRoot";
const PERSIST_DEBOUNCE_MS = 600;
function readStoredPort() {
  if (typeof window === "undefined") return DEFAULT_PORT;
  const raw = window.localStorage.getItem(PORT_STORAGE_KEY);
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 && parsed < 65536 ? parsed : DEFAULT_PORT;
}
function readProjectRoot() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PROJECT_ROOT_KEY) || "";
}
function deviceKeyOf(payload) {
  return payload.deviceId || payload.clientName || payload.clientId || "unknown";
}
function readHiddenRules() {
  if (typeof window === "undefined") return [];
  try {
    const arr = JSON.parse(window.localStorage.getItem(HIDDEN_RULES_KEY) || "[]");
    return Array.isArray(arr) ? arr.filter((r) => r && typeof r.match === "string") : [];
  } catch {
    return [];
  }
}
function readStoredDevices() {
  const map = /* @__PURE__ */ new Map();
  if (typeof window === "undefined") return map;
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(RECORDS_STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) return map;
    for (const d of raw) {
      if (!d || !d.key) continue;
      const networkMap = /* @__PURE__ */ new Map();
      for (const r of Array.isArray(d.networkRequests) ? d.networkRequests : []) {
        if (r && r.id != null) networkMap.set(String(r.id), r);
      }
      const wsMap = /* @__PURE__ */ new Map();
      for (const c of Array.isArray(d.wsConnections) ? d.wsConnections : []) {
        if (c && c.wsId != null) wsMap.set(String(c.wsId), { ...c, frames: Array.isArray(c.frames) ? c.frames : [] });
      }
      map.set(d.key, {
        key: d.key,
        name: d.name || null,
        platform: d.platform || null,
        networkMap,
        wsMap,
        consoleLogs: Array.isArray(d.consoleLogs) ? d.consoleLogs : [],
        storage: d.storage && Array.isArray(d.storage.backends) ? d.storage : null
      });
    }
  } catch {
  }
  return map;
}
function useRnspyDevtools() {
  const rnspy = typeof window !== "undefined" ? window.electron?.rnspy : null;
  const available = !!rnspy;
  const [port, setPortState] = reactExports.useState(readStoredPort);
  const [status, setStatus] = reactExports.useState({
    running: false,
    clientCount: 0,
    port: readStoredPort(),
    address: "localhost",
    clients: []
  });
  const [devices, setDevices] = reactExports.useState([]);
  const [hiddenRules, setHiddenRules] = reactExports.useState(readHiddenRules);
  const [projectRoot, setProjectRootState] = reactExports.useState(readProjectRoot);
  const [serverLogs, setServerLogs] = reactExports.useState([]);
  const devicesRef = reactExports.useRef(null);
  if (devicesRef.current === null) devicesRef.current = readStoredDevices();
  const persistTimerRef = reactExports.useRef(null);
  const schedulePersist = reactExports.useCallback(() => {
    if (typeof window === "undefined") return;
    if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      try {
        const serial = Array.from(devicesRef.current.values()).map((d) => ({
          key: d.key,
          name: d.name,
          platform: d.platform,
          networkRequests: Array.from(d.networkMap.values()),
          wsConnections: Array.from(d.wsMap.values()),
          consoleLogs: d.consoleLogs
        }));
        window.sessionStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(serial));
      } catch {
      }
    }, PERSIST_DEBOUNCE_MS);
  }, []);
  const rebuildDevices = reactExports.useCallback(() => {
    const arr = Array.from(devicesRef.current.values()).map((d) => ({
      key: d.key,
      name: d.name,
      platform: d.platform,
      networkRequests: Array.from(d.networkMap.values()),
      wsConnections: Array.from(d.wsMap.values()).map((c) => ({
        ...c,
        frames: c.frames.slice()
      })),
      consoleLogs: d.consoleLogs.slice(),
      storage: d.storage,
      watermelon: d.watermelon,
      navigation: d.navigation
    }));
    setDevices(arr);
    schedulePersist();
  }, [schedulePersist]);
  const ensureDevice = reactExports.useCallback((payload) => {
    const key = deviceKeyOf(payload);
    let dev = devicesRef.current.get(key);
    if (!dev) {
      dev = {
        key,
        name: payload.clientName || null,
        platform: payload.clientPlatform || null,
        networkMap: /* @__PURE__ */ new Map(),
        wsMap: /* @__PURE__ */ new Map(),
        consoleLogs: [],
        storage: null,
        watermelon: null,
        navigation: null
      };
      devicesRef.current.set(key, dev);
    } else {
      if (payload.clientName) dev.name = payload.clientName;
      if (payload.clientPlatform) dev.platform = payload.clientPlatform;
    }
    return dev;
  }, []);
  const startOnPort = reactExports.useCallback((nextPort) => {
    if (!rnspy) return;
    rnspy.start({ port: nextPort }).then((res) => {
      if (res && res.ok) {
        setStatus((s) => ({
          ...s,
          running: true,
          port: nextPort,
          clientCount: res.clientCount ?? s.clientCount,
          clients: res.clients ?? s.clients
        }));
      } else {
        setStatus((s) => ({
          ...s,
          running: false,
          port: nextPort,
          error: res?.reason || "failed-to-start"
        }));
      }
    });
  }, [rnspy]);
  reactExports.useEffect(() => {
    if (!rnspy) return void 0;
    startOnPort(port);
    const offEvent = rnspy.onEvent((payload) => {
      if (!payload || !payload.kind) return;
      if (payload.kind === "console") {
        const dev = ensureDevice(payload);
        const logs = dev.consoleLogs;
        logs.push({
          id: payload.id || `seq-${payload.seq}`,
          seq: payload.seq,
          level: payload.level || "log",
          args: Array.isArray(payload.args) ? payload.args : [payload.args],
          timestamp: payload.timestamp || payload.receivedAt || Date.now(),
          caller: payload.caller || null,
          stack: payload.stack || null
        });
        if (logs.length > MAX_CONSOLE_LOGS) logs.splice(0, logs.length - MAX_CONSOLE_LOGS);
        rebuildDevices();
        return;
      }
      if (payload.kind === "network-start" || payload.kind === "network") {
        const dev = ensureDevice(payload);
        const map = dev.networkMap;
        const id = payload.id != null ? String(payload.id) : `seq-${payload.seq}`;
        const existing = map.get(id) || {};
        const merged = {
          ...existing,
          ...payload,
          id,
          seq: payload.seq ?? existing.seq,
          pending: payload.kind === "network-start" && existing.status == null
        };
        if (payload.kind === "network") merged.pending = false;
        map.set(id, merged);
        if (map.size > MAX_NETWORK_REQUESTS) {
          const oldestKey = map.keys().next().value;
          map.delete(oldestKey);
        }
        rebuildDevices();
        return;
      }
      if (payload.kind === "ws-open") {
        const dev = ensureDevice(payload);
        const id = String(payload.wsId || `seq-${payload.seq}`);
        if (!dev.wsMap.has(id)) {
          dev.wsMap.set(id, {
            wsId: id,
            url: payload.url || "",
            protocols: payload.protocols || null,
            status: "open",
            startTime: payload.startTime || payload.timestamp,
            seq: payload.seq,
            frames: []
          });
          if (dev.wsMap.size > MAX_NETWORK_REQUESTS) {
            const oldestKey = dev.wsMap.keys().next().value;
            dev.wsMap.delete(oldestKey);
          }
        }
        rebuildDevices();
        return;
      }
      if (payload.kind === "ws-frame") {
        const dev = ensureDevice(payload);
        const id = String(payload.wsId || `seq-${payload.seq}`);
        let conn = dev.wsMap.get(id);
        if (!conn) {
          conn = {
            wsId: id,
            url: payload.url || "",
            protocols: null,
            status: "open",
            startTime: payload.timestamp,
            seq: payload.seq,
            frames: []
          };
          dev.wsMap.set(id, conn);
        }
        conn.frames.push({
          dir: payload.dir === "send" ? "send" : "recv",
          data: payload.data,
          size: payload.size ?? (typeof payload.data === "string" ? payload.data.length : 0),
          timestamp: payload.timestamp || Date.now()
        });
        if (conn.frames.length > MAX_WS_FRAMES)
          conn.frames.splice(0, conn.frames.length - MAX_WS_FRAMES);
        rebuildDevices();
        return;
      }
      if (payload.kind === "storage-snapshot") {
        const dev = ensureDevice(payload);
        const failedMutation = payload.mutation && payload.mutation.ok === false;
        const incoming = Array.isArray(payload.backends) ? payload.backends : [];
        const haveData = dev.storage && Array.isArray(dev.storage.backends) && dev.storage.backends.length > 0;
        if (failedMutation && dev.storage) {
          dev.storage = { ...dev.storage, mutation: payload.mutation, diag: payload.diag || dev.storage.diag || null };
        } else if (incoming.length === 0 && haveData && !payload.error) {
          dev.storage = { ...dev.storage, diag: payload.diag || dev.storage.diag || null };
        } else {
          dev.storage = {
            backends: incoming,
            updatedAt: Date.now(),
            error: payload.error || null,
            mutation: payload.mutation || null,
            diag: payload.diag || null
          };
        }
        rebuildDevices();
        return;
      }
      if (payload.kind === "navigation") {
        const dev = ensureDevice(payload);
        const stack = Array.isArray(payload.stack) ? payload.stack : [];
        const focused = stack.length ? stack[stack.length - 1] : null;
        const prev = dev.navigation || null;
        const history = prev && Array.isArray(prev.history) ? prev.history : [];
        const last = history.length ? history[history.length - 1] : null;
        const isNewRoute = focused && (!last || last.key !== focused.key || last.name !== focused.name || JSON.stringify(last.params) !== JSON.stringify(focused.params));
        if (isNewRoute) {
          history.push({
            id: `nav-${payload.seq}`,
            name: focused.name,
            key: focused.key,
            params: focused.params,
            from: payload.prevRouteName || null,
            path: stack.map((r) => r.name),
            timestamp: payload.timestamp || payload.receivedAt || Date.now()
          });
          if (history.length > MAX_NAV_HISTORY) {
            history.splice(0, history.length - MAX_NAV_HISTORY);
          }
        }
        dev.navigation = {
          stack,
          current: focused,
          prevRouteName: payload.prevRouteName || null,
          // Screens arrive on their own event too; never let an omitted field
          // wipe a registry we already hold.
          screens: payload.screens || prev && prev.screens || {},
          history,
          available: !!payload.available,
          updatedAt: Date.now(),
          diag: payload.diag || prev && prev.diag || null
        };
        rebuildDevices();
        return;
      }
      if (payload.kind === "navigation-registry") {
        const dev = ensureDevice(payload);
        const prev = dev.navigation;
        const screens = { ...prev && prev.screens || {}, ...payload.screens || {} };
        dev.navigation = prev ? { ...prev, screens } : {
          stack: [],
          current: null,
          prevRouteName: null,
          screens,
          history: [],
          available: true,
          updatedAt: Date.now(),
          diag: null
        };
        rebuildDevices();
        return;
      }
      if (payload.kind === "watermelon-snapshot") {
        const dev = ensureDevice(payload);
        const incoming = Array.isArray(payload.tables) ? payload.tables : [];
        const haveData = dev.watermelon && Array.isArray(dev.watermelon.tables) && dev.watermelon.tables.length > 0;
        if (incoming.length === 0 && haveData && !payload.error && payload.available === false) {
          dev.watermelon = { ...dev.watermelon, diag: payload.diag || dev.watermelon.diag || null };
        } else {
          dev.watermelon = {
            tables: incoming,
            // Preserve already-loaded row pages across table-list refreshes.
            pages: dev.watermelon && dev.watermelon.pages || {},
            available: !!payload.available,
            updatedAt: Date.now(),
            error: payload.error || null,
            diag: payload.diag || null
          };
        }
        rebuildDevices();
        return;
      }
      if (payload.kind === "watermelon-page") {
        const dev = ensureDevice(payload);
        const p = payload.page || {};
        if (!p.table) return;
        if (!dev.watermelon) {
          dev.watermelon = { tables: [], pages: {}, available: !!payload.available, updatedAt: Date.now(), error: null, diag: null };
        }
        if (!dev.watermelon.pages) dev.watermelon.pages = {};
        const prev = dev.watermelon.pages[p.table] || { rows: [], total: 0, columns: [] };
        const offset = p.offset || 0;
        const merged = prev.rows.slice(0, offset).concat(Array.isArray(p.rows) ? p.rows : []);
        const meta = (dev.watermelon.tables || []).find((t) => t.table === p.table);
        const columns = meta && meta.columns && meta.columns.length ? meta.columns : merged.length ? Object.keys(merged[0].fields || {}) : prev.columns;
        dev.watermelon.pages = {
          ...dev.watermelon.pages,
          [p.table]: {
            rows: merged,
            total: p.total != null ? p.total : prev.total,
            columns,
            paged: !!p.paged,
            error: p.error || null,
            loadedAt: Date.now()
          }
        };
        dev.watermelon = { ...dev.watermelon };
        rebuildDevices();
        return;
      }
      if (payload.kind === "ws-close" || payload.kind === "ws-error") {
        const dev = ensureDevice(payload);
        const id = String(payload.wsId || `seq-${payload.seq}`);
        const conn = dev.wsMap.get(id);
        if (conn) {
          conn.status = payload.kind === "ws-error" ? "error" : "closed";
          if (payload.kind === "ws-close") {
            conn.closeCode = payload.code;
            conn.closeReason = payload.reason || "";
            conn.endTime = payload.endTime || payload.timestamp;
          }
          rebuildDevices();
        }
        return;
      }
    });
    const offStatus = rnspy.onStatus((payload) => {
      if (payload) setStatus((s) => ({ ...s, ...payload }));
    });
    if (rnspy.getLogs) {
      rnspy.getLogs().then((logs) => {
        if (Array.isArray(logs)) setServerLogs(logs.slice(-MAX_SERVER_LOGS));
      });
    }
    const offLog = rnspy.onLog ? rnspy.onLog((entry) => {
      if (!entry) return;
      setServerLogs((prev) => {
        const next = prev.concat(entry);
        if (next.length > MAX_SERVER_LOGS) next.splice(0, next.length - MAX_SERVER_LOGS);
        return next;
      });
    }) : null;
    return () => {
      offEvent && offEvent();
      offStatus && offStatus();
      offLog && offLog();
      rnspy.stop();
    };
  }, [rnspy]);
  const onlineKeys = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const c of status.clients || [])
      set.add(c.deviceId || c.name || c.id || "unknown");
    return set;
  }, [status.clients]);
  const devicesView = reactExports.useMemo(
    () => devices.map((d) => ({ ...d, online: onlineKeys.has(d.key) })),
    [devices, onlineKeys]
  );
  const setPort = reactExports.useCallback((nextPort) => {
    const parsed = parseInt(nextPort, 10);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed >= 65536) return;
    setPortState(parsed);
    if (typeof window !== "undefined")
      window.localStorage.setItem(PORT_STORAGE_KEY, String(parsed));
    startOnPort(parsed);
  }, [startOnPort]);
  const setProjectRoot = reactExports.useCallback((root) => {
    const val = (root || "").trim();
    setProjectRootState(val);
    if (typeof window !== "undefined")
      window.localStorage.setItem(PROJECT_ROOT_KEY, val);
  }, []);
  const setupHost = status.address || "localhost";
  const pickProjectFolder = reactExports.useCallback(() => {
    if (!rnspy?.pickProjectFolder)
      return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.pickProjectFolder();
  }, [rnspy]);
  const detectProject = reactExports.useCallback((dir) => {
    if (!rnspy?.detectProject) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.detectProject({ dir });
  }, [rnspy]);
  const planProjectSetup = reactExports.useCallback((dir) => {
    if (!rnspy?.planSetup) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.planSetup({ dir, host: setupHost, port });
  }, [rnspy, setupHost, port]);
  const applyProjectSetup = reactExports.useCallback((dir) => {
    if (!rnspy?.applySetup) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.applySetup({ dir, host: setupHost, port });
  }, [rnspy, setupHost, port]);
  const removeProjectSetup = reactExports.useCallback((dir) => {
    if (!rnspy?.removeSetup) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.removeSetup({ dir });
  }, [rnspy]);
  const openInEditor = reactExports.useCallback((file, line, column) => {
    if (!rnspy?.openInEditor) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.openInEditor({ file, line, column, projectRoot });
  }, [rnspy, projectRoot]);
  const symbolicateAndOpen = reactExports.useCallback((rawStack, fallbackCaller) => {
    if (!rnspy) return Promise.resolve({ ok: false, reason: "not-available" });
    if (rawStack && rnspy.symbolicate) {
      return rnspy.symbolicate({ stack: rawStack }).then((res) => {
        if (res?.ok && res.caller?.file) {
          return rnspy.openInEditor({
            file: res.caller.file,
            line: res.caller.line || 1,
            column: res.caller.col || 1,
            projectRoot
          });
        }
        if (fallbackCaller?.file) {
          return rnspy.openInEditor({
            file: fallbackCaller.file,
            line: fallbackCaller.line || 1,
            column: fallbackCaller.col || 1,
            projectRoot
          });
        }
        return { ok: false, reason: res?.reason || "no-caller" };
      });
    }
    if (fallbackCaller?.file) {
      return rnspy.openInEditor({
        file: fallbackCaller.file,
        line: fallbackCaller.line || 1,
        column: fallbackCaller.col || 1,
        projectRoot
      });
    }
    return Promise.resolve({ ok: false, reason: "no-stack-or-caller" });
  }, [rnspy, projectRoot]);
  const disconnectClientById = reactExports.useCallback((id) => {
    if (rnspy?.disconnectClient) rnspy.disconnectClient(id);
  }, [rnspy]);
  const reloadDevice = reactExports.useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({ deviceKey: key, command: "reload" });
  }, [rnspy]);
  const readStorage = reactExports.useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({ deviceKey: key, command: "storage-read", payload: { reqId: Date.now() } });
  }, [rnspy]);
  const setStorageValue = reactExports.useCallback((key, { backend, instanceId, storageKey, value, type }) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({
      deviceKey: key,
      command: "storage-set",
      payload: { reqId: Date.now(), backend, instanceId, key: storageKey, value, type: type || "string" }
    });
  }, [rnspy]);
  const removeStorageKey = reactExports.useCallback((key, { backend, instanceId, storageKey }) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({
      deviceKey: key,
      command: "storage-remove",
      payload: { reqId: Date.now(), backend, instanceId, key: storageKey }
    });
  }, [rnspy]);
  const openStorageInstance = reactExports.useCallback((key, instanceId) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({
      deviceKey: key,
      command: "storage-open-instance",
      payload: { reqId: Date.now(), instanceId }
    });
  }, [rnspy]);
  const readNavigation = reactExports.useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({ deviceKey: key, command: "navigation-read", payload: { reqId: Date.now() } });
  }, [rnspy]);
  const openRouteInEditor = reactExports.useCallback(({ routeName, componentName }) => {
    if (!rnspy?.resolveRoute) return Promise.resolve({ ok: false, reason: "not-available" });
    if (!projectRoot) return Promise.resolve({ ok: false, reason: "no-project-root" });
    return rnspy.resolveRoute({ routeName, componentName, projectRoot }).then((res) => {
      if (!res?.ok || !res.file) {
        return { ok: false, stage: "resolve", ...res || { reason: "not-found" } };
      }
      return rnspy.openInEditor({
        file: res.file,
        line: res.line || 1,
        column: 1,
        projectRoot
      }).then((open) => ({
        ...open,
        stage: "open",
        file: res.file,
        ambiguous: res.ambiguous,
        candidates: res.candidates
      }));
    });
  }, [rnspy, projectRoot]);
  const readWatermelon = reactExports.useCallback((key) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({ deviceKey: key, command: "watermelon-read", payload: { reqId: Date.now() } });
  }, [rnspy]);
  const readWatermelonPage = reactExports.useCallback((key, table, offset, limit = 50) => {
    if (!rnspy?.sendCommand) return Promise.resolve({ ok: false, reason: "not-available" });
    return rnspy.sendCommand({
      deviceKey: key,
      command: "watermelon-page",
      payload: { reqId: Date.now(), table, offset, limit }
    });
  }, [rnspy]);
  const disconnectDevice = reactExports.useCallback((key) => {
    if (!rnspy?.disconnectClient) return;
    for (const c of status.clients || []) {
      if ((c.deviceId || c.name || c.id || "unknown") === key)
        rnspy.disconnectClient(c.id);
    }
  }, [rnspy, status.clients]);
  const closeDevice = reactExports.useCallback((key) => {
    devicesRef.current.delete(key);
    rebuildDevices();
  }, [rebuildDevices]);
  const clearDevice = reactExports.useCallback((key) => {
    const dev = devicesRef.current.get(key);
    if (!dev) return;
    dev.networkMap.clear();
    dev.wsMap.clear();
    dev.consoleLogs = [];
    rebuildDevices();
  }, [rebuildDevices]);
  const clearDeviceCategory = reactExports.useCallback((key, category) => {
    const dev = devicesRef.current.get(key);
    if (!dev) return;
    if (category === "network") dev.networkMap.clear();
    else if (category === "websocket") dev.wsMap.clear();
    else if (category === "console") dev.consoleLogs = [];
    else if (category === "navigation") {
      if (dev.navigation) dev.navigation = { ...dev.navigation, history: [] };
    } else return;
    rebuildDevices();
  }, [rebuildDevices]);
  const clear = reactExports.useCallback(() => {
    devicesRef.current.clear();
    rebuildDevices();
  }, [rebuildDevices]);
  const clearServerLogs = reactExports.useCallback(() => {
    setServerLogs([]);
    if (rnspy?.clearLogs) rnspy.clearLogs();
  }, [rnspy]);
  const writeHiddenRules = reactExports.useCallback((rules) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HIDDEN_RULES_KEY, JSON.stringify(rules));
    }
  }, []);
  const addHiddenRule = reactExports.useCallback((rule) => {
    if (!rule || !rule.match) return;
    setHiddenRules((prev) => {
      const match = String(rule.match);
      const next = prev.filter((r) => r.match !== match).concat({ match, hideRelated: !!rule.hideRelated });
      writeHiddenRules(next);
      return next;
    });
  }, [writeHiddenRules]);
  const removeHiddenRule = reactExports.useCallback((match) => {
    setHiddenRules((prev) => {
      const next = prev.filter((r) => r.match !== match);
      writeHiddenRules(next);
      return next;
    });
  }, [writeHiddenRules]);
  const resetAll = reactExports.useCallback(() => {
    devicesRef.current.clear();
    rebuildDevices();
    setServerLogs([]);
    if (rnspy?.clearLogs) rnspy.clearLogs();
    setHiddenRules([]);
    writeHiddenRules([]);
    setProjectRootState("");
    if (typeof window !== "undefined")
      window.localStorage.removeItem(PROJECT_ROOT_KEY);
    setPortState(DEFAULT_PORT);
    if (typeof window !== "undefined")
      window.localStorage.removeItem(PORT_STORAGE_KEY);
    startOnPort(DEFAULT_PORT);
    if (typeof window !== "undefined")
      window.sessionStorage.removeItem(RECORDS_STORAGE_KEY);
    if (rnspy?.disconnectClient) {
      for (const c of status.clients || []) rnspy.disconnectClient(c.id);
    }
  }, [rebuildDevices, rnspy, writeHiddenRules, startOnPort, status.clients]);
  return {
    available,
    status,
    port,
    setPort,
    devices: devicesView,
    projectRoot,
    setProjectRoot,
    openInEditor,
    symbolicateAndOpen,
    setupHost,
    pickProjectFolder,
    detectProject,
    planProjectSetup,
    applyProjectSetup,
    removeProjectSetup,
    hiddenRules,
    addHiddenRule,
    removeHiddenRule,
    disconnectDevice,
    disconnectClientById,
    reloadDevice,
    readStorage,
    setStorageValue,
    removeStorageKey,
    openStorageInstance,
    readWatermelon,
    readWatermelonPage,
    readNavigation,
    openRouteInEditor,
    closeDevice,
    clearDevice,
    clearDeviceCategory,
    clear,
    serverLogs,
    clearServerLogs,
    resetAll
  };
}
const TABS = [
  { key: "network", label: "Network" },
  { key: "websocket", label: "WebSocket" },
  { key: "console", label: "Console" },
  { key: "storage", label: "Storage" },
  { key: "watermelon", label: "WatermelonDB" },
  { key: "navigation", label: "Navigation" },
  { key: "logs", label: "Logs" }
];
function RnspyDevtoolsPage() {
  const {
    available,
    status,
    port,
    setPort,
    devices,
    hiddenRules,
    addHiddenRule,
    removeHiddenRule,
    projectRoot,
    setProjectRoot,
    openInEditor,
    symbolicateAndOpen,
    setupHost,
    pickProjectFolder,
    planProjectSetup,
    applyProjectSetup,
    removeProjectSetup,
    disconnectClientById,
    closeDevice,
    clearDeviceCategory,
    reloadDevice,
    readStorage,
    setStorageValue,
    removeStorageKey,
    openStorageInstance,
    readWatermelon,
    readWatermelonPage,
    readNavigation,
    openRouteInEditor,
    serverLogs,
    clearServerLogs,
    resetAll
  } = useRnspyDevtools();
  const [tab, setTab] = reactExports.useState("network");
  const [activeKey, setActiveKey] = reactExports.useState(null);
  const [settingsOpen, setSettingsOpen] = reactExports.useState(false);
  const [issuesOpen, setIssuesOpen] = reactExports.useState(false);
  const [projectSetupOpen, setProjectSetupOpen] = reactExports.useState(false);
  const [storageAutoRefresh, setStorageAutoRefresh] = reactExports.useState(true);
  const [watermelonAutoRefresh, setWatermelonAutoRefresh] = reactExports.useState(true);
  const [navigationAutoRefresh, setNavigationAutoRefresh] = reactExports.useState(true);
  const [reloadingKeys, setReloadingKeys] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const restartClientsRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const restartTimersRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const issuesBtnRef = reactExports.useRef(null);
  const networkRef = reactExports.useRef(null);
  const websocketRef = reactExports.useRef(null);
  const consoleRef = reactExports.useRef(null);
  const navigationRef = reactExports.useRef(null);
  const logsRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!devices.length) {
      if (activeKey !== null) setActiveKey(null);
      return;
    }
    if (!activeKey || !devices.some((d) => d.key === activeKey)) {
      setActiveKey(devices[0].key);
    }
  }, [devices, activeKey]);
  const activeDevice = reactExports.useMemo(
    () => devices.find((d) => d.key === activeKey) || null,
    [devices, activeKey]
  );
  const issues = useIssues({ devices, serverLogs });
  if (!available) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "var(--space-3)",
      background: "var(--bg-app)",
      height: "100%",
      color: "var(--text-tertiary)",
      fontFamily: "var(--font-ui)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 24, style: { opacity: 0.3 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-md)", fontWeight: 600, color: "var(--text-secondary)" }, children: "Desktop only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "var(--text-sm)", maxWidth: 340, textAlign: "center", lineHeight: "var(--line-height-normal)" }, children: "React Native Spy requires the Electron desktop app." })
    ] });
  }
  const connected = status.clientCount > 0;
  const running = status.running;
  const address = status.address || "localhost";
  const statusBadge = connected ? { style: BADGE_SUCCESS } : running ? { style: BADGE_WARNING } : { style: BADGE_DANGER };
  const statusLabel2 = connected ? `${status.clientCount} connected` : running ? "Waiting" : "Offline";
  const tabCounts = {
    network: activeDevice?.networkRequests.length || 0,
    websocket: activeDevice?.wsConnections?.length || 0,
    console: activeDevice?.consoleLogs.length || 0,
    storage: (activeDevice?.storage?.backends || []).reduce((sum, b) => sum + (b.entries?.length || 0), 0),
    watermelon: (activeDevice?.watermelon?.tables || []).reduce((sum, t) => sum + (t.rowCount || 0), 0),
    navigation: activeDevice?.navigation?.history?.length || 0,
    logs: serverLogs.length
  };
  const clearActiveTab = (key) => {
    if (tab === "logs") clearServerLogs();
    else clearDeviceCategory(key, tab);
  };
  const handleReload = reactExports.useCallback((key) => {
    if (reloadingKeys.has(key)) return;
    const deviceClients = (status.clients || []).filter((c) => (c.deviceId || c.name || c.id || "unknown") === key).map((c) => c.id);
    restartClientsRef.current.set(key, new Set(deviceClients));
    setReloadingKeys((prev) => {
      const n = new Set(prev);
      n.add(key);
      return n;
    });
    reloadDevice(key);
    const timer = setTimeout(() => {
      setReloadingKeys((prev) => {
        const n = new Set(prev);
        n.delete(key);
        return n;
      });
      restartClientsRef.current.delete(key);
      restartTimersRef.current.delete(key);
    }, 8e3);
    restartTimersRef.current.set(key, timer);
  }, [reloadDevice, reloadingKeys, status.clients]);
  reactExports.useEffect(() => {
    const isMac = navigator.platform.toLowerCase().includes("mac");
    const mod = (e) => isMac ? e.metaKey : e.ctrlKey;
    const focusSearch = () => {
      const ref = {
        network: networkRef,
        websocket: websocketRef,
        console: consoleRef,
        navigation: navigationRef,
        logs: logsRef
      }[tab];
      ref?.current?.focusSearch?.();
    };
    const onKeyDown = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const editable = e.target?.isContentEditable;
      const typing = tag === "input" || tag === "textarea" || tag === "select" || editable;
      if (e.key === "Escape") {
        if (projectSetupOpen) {
          setProjectSetupOpen(false);
          return;
        }
        if (settingsOpen) {
          setSettingsOpen(false);
          return;
        }
        if (issuesOpen) {
          setIssuesOpen(false);
          return;
        }
      }
      if (!mod(e)) return;
      if (e.key >= "1" && e.key <= "7") {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < TABS.length) {
          e.preventDefault();
          setTab(TABS[idx].key);
        }
        return;
      }
      switch (e.key.toLowerCase()) {
        case "k":
          e.preventDefault();
          if (activeKey || tab === "logs") clearActiveTab(activeKey);
          break;
        case "r":
          e.preventDefault();
          if (activeKey && activeDevice?.online && !reloadingKeys.has(activeKey)) {
            handleReload(activeKey);
          }
          break;
        case "f":
          if (typing) return;
          e.preventDefault();
          focusSearch();
          break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab, activeKey, activeDevice?.online, reloadingKeys, projectSetupOpen, settingsOpen, issuesOpen]);
  reactExports.useEffect(() => {
    if (!reloadingKeys.size) return;
    for (const key of Array.from(reloadingKeys)) {
      const prev = restartClientsRef.current.get(key);
      if (!prev) continue;
      const reconnected = (status.clients || []).some(
        (c) => (c.deviceId || c.name || c.id || "unknown") === key && !prev.has(c.id)
      );
      if (reconnected) {
        setReloadingKeys((p) => {
          const n = new Set(p);
          n.delete(key);
          return n;
        });
        restartClientsRef.current.delete(key);
        const t = restartTimersRef.current.get(key);
        if (t) {
          clearTimeout(t);
          restartTimersRef.current.delete(key);
        }
      }
    }
  }, [status.clients, reloadingKeys]);
  reactExports.useEffect(() => {
    if (tab !== "storage" || !storageAutoRefresh) return void 0;
    if (!activeDevice?.online) return void 0;
    const key = activeDevice.key;
    readStorage(key);
    const timer = setInterval(() => readStorage(key), 2e3);
    return () => clearInterval(timer);
  }, [tab, storageAutoRefresh, activeDevice?.online, activeDevice?.key, readStorage]);
  reactExports.useEffect(() => {
    if (tab !== "watermelon" || !watermelonAutoRefresh) return void 0;
    if (!activeDevice?.online) return void 0;
    const key = activeDevice.key;
    readWatermelon(key);
    const timer = setInterval(() => readWatermelon(key), 3e3);
    return () => clearInterval(timer);
  }, [tab, watermelonAutoRefresh, activeDevice?.online, activeDevice?.key, readWatermelon]);
  reactExports.useEffect(() => {
    if (tab !== "navigation" || !navigationAutoRefresh) return void 0;
    if (!activeDevice?.online) return void 0;
    const key = activeDevice.key;
    readNavigation(key);
    const timer = setInterval(() => readNavigation(key), 5e3);
    return () => clearInterval(timer);
  }, [tab, navigationAutoRefresh, activeDevice?.online, activeDevice?.key, readNavigation]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    background: "var(--bg-app)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "titlebar-drag", style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      padding: "0 var(--space-4)",
      height: "var(--header-height)",
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-sidebar)",
      flexShrink: 0
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 62, flexShrink: 0 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-ui)"
        }, children: "React Native Spy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 1, height: 16, background: "var(--border-subtle)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        ...statusBadge.style,
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "currentColor"
        } }),
        statusLabel2
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            navigator.clipboard.writeText(`ws://${address}:${port}`).then(() => zt.success("Copied connection URL"));
          },
          title: "Click to copy connection URL",
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-1)",
            height: 24,
            padding: "0 var(--space-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-card)",
            cursor: "pointer",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-mono)",
            color: "var(--text-secondary)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 11, color: "var(--text-tertiary)" }),
            "ws://",
            address,
            ":",
            port
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UpdateButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        IssuesButton,
        {
          ref: issuesBtnRef,
          errorCount: issues.errorCount,
          warnCount: issues.warnCount,
          total: issues.total,
          onClick: () => setIssuesOpen(true)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeMenu, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setProjectSetupOpen(true),
          style: { ...BTN_GHOST, gap: "var(--space-1)" },
          title: "Connect a React Native project folder",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Project" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSettingsOpen(true),
          style: { ...BTN_GHOST, gap: "var(--space-1)" },
          title: "Settings",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Settings" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      alignItems: "stretch",
      height: "var(--tab-height)",
      flexShrink: 0,
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--bg-panel-alt)"
    }, children: TABS.map((t) => {
      const active = tab === t.key;
      const count = tabCounts[t.key];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setTab(t.key),
          style: {
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            padding: "0 var(--space-4)",
            height: "100%",
            border: "none",
            borderBottom: active ? "2px solid var(--accent-primary)" : "2px solid transparent",
            background: "transparent",
            color: active ? "var(--text-primary)" : "var(--text-tertiary)",
            fontSize: "var(--text-sm)",
            fontWeight: active ? "var(--font-weight-semibold)" : "var(--font-weight-medium)",
            fontFamily: "var(--font-ui)",
            cursor: "pointer",
            transition: "color 120ms ease"
          },
          children: [
            t.label,
            count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
              fontSize: 10,
              fontWeight: "var(--font-weight-medium)",
              fontFamily: "var(--font-mono)",
              color: active ? "var(--accent-primary)" : "var(--text-tertiary)",
              marginLeft: 2
            }, children: count > 999 ? "1k+" : count })
          ]
        },
        t.key
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeviceTabs,
      {
        devices,
        activeKey,
        onSelect: setActiveKey,
        onClose: closeDevice
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: tab === "logs" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      LogsTab,
      {
        ref: logsRef,
        logs: serverLogs,
        onClear: () => clearActiveTab(activeKey),
        onReload: () => handleReload(activeKey),
        canReload: activeDevice?.online && !reloadingKeys.has(activeKey)
      }
    ) : !activeDevice ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConnectSnippet,
      {
        host: address,
        port,
        onAutoSetup: () => setProjectSetupOpen(true)
      }
    ) : tab === "network" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      NetworkTab,
      {
        ref: networkRef,
        requests: activeDevice.networkRequests,
        hiddenRules,
        onHideName: addHiddenRule,
        onClear: () => clearActiveTab(activeKey),
        onReload: () => handleReload(activeKey),
        canReload: activeDevice?.online && !reloadingKeys.has(activeKey)
      }
    ) : tab === "websocket" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      WebSocketTab,
      {
        ref: websocketRef,
        connections: activeDevice.wsConnections || [],
        onClear: () => clearActiveTab(activeKey),
        onReload: () => handleReload(activeKey),
        canReload: activeDevice?.online && !reloadingKeys.has(activeKey)
      }
    ) : tab === "storage" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      StorageTab,
      {
        storage: activeDevice.storage,
        online: activeDevice?.online,
        onRefresh: () => readStorage(activeKey),
        onSetValue: (args) => setStorageValue(activeKey, args),
        onRemoveKey: (args) => removeStorageKey(activeKey, args),
        onOpenInstance: (id) => openStorageInstance(activeKey, id),
        autoRefresh: storageAutoRefresh,
        onToggleAutoRefresh: () => setStorageAutoRefresh((v) => !v)
      }
    ) : tab === "navigation" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      NavigationTab,
      {
        ref: navigationRef,
        navigation: activeDevice.navigation,
        online: activeDevice?.online,
        onRefresh: () => readNavigation(activeKey),
        onOpenRoute: openRouteInEditor,
        onClear: () => clearActiveTab(activeKey),
        onReload: () => handleReload(activeKey),
        canReload: activeDevice?.online && !reloadingKeys.has(activeKey),
        autoRefresh: navigationAutoRefresh,
        onToggleAutoRefresh: () => setNavigationAutoRefresh((v) => !v)
      }
    ) : tab === "watermelon" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      WatermelonTab,
      {
        watermelon: activeDevice.watermelon,
        online: activeDevice?.online,
        onRefresh: () => readWatermelon(activeKey),
        onLoadPage: (table, offset, limit) => readWatermelonPage(activeKey, table, offset, limit),
        autoRefresh: watermelonAutoRefresh,
        onToggleAutoRefresh: () => setWatermelonAutoRefresh((v) => !v)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConsoleTab,
      {
        ref: consoleRef,
        logs: activeDevice.consoleLogs,
        openInEditor,
        symbolicateAndOpen,
        onClear: () => clearActiveTab(activeKey),
        onReload: () => handleReload(activeKey),
        canReload: activeDevice?.online && !reloadingKeys.has(activeKey)
      }
    ) }),
    issuesOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      IssuesModal,
      {
        issues: issues.issues,
        errorCount: issues.errorCount,
        warnCount: issues.warnCount,
        bySource: issues.bySource,
        onOpenInEditor: openInEditor,
        returnFocusRef: issuesBtnRef,
        onClose: () => setIssuesOpen(false)
      }
    ),
    settingsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RnspySettingsModal,
      {
        clients: status.clients || [],
        hiddenRules,
        port,
        onSetPort: setPort,
        projectRoot,
        onSetProjectRoot: setProjectRoot,
        onDisconnect: disconnectClientById,
        onReload: reloadDevice,
        onAddRule: addHiddenRule,
        onRemoveRule: removeHiddenRule,
        onReset: () => {
          resetAll();
          setSettingsOpen(false);
        },
        onClose: () => setSettingsOpen(false)
      }
    ),
    projectSetupOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProjectSetupModal,
      {
        projectRoot,
        host: setupHost,
        port,
        onPickFolder: pickProjectFolder,
        onPlan: planProjectSetup,
        onApply: applyProjectSetup,
        onRemove: removeProjectSetup,
        onSetProjectRoot: setProjectRoot,
        onOpenFile: (file) => openInEditor(file, 1, 1),
        onClose: () => setProjectSetupOpen(false)
      }
    )
  ] });
}
function ConnectSnippet({ host, port, onAutoSetup }) {
  const [copied, setCopied] = reactExports.useState(false);
  const snippet = reactExports.useMemo(() => buildRnClient({ host, port }), [host, port]);
  const copy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
    flex: 1,
    overflow: "auto",
    background: "var(--bg-panel)",
    display: "flex",
    justifyContent: "center",
    padding: "var(--space-8) var(--space-6)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-slide-up", style: { maxWidth: 620, width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3)",
      marginBottom: "var(--space-4)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { size: 22 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: {
          margin: 0,
          fontSize: "var(--text-md)",
          fontWeight: "var(--font-weight-semibold)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-ui)",
          lineHeight: "var(--line-height-tight)"
        }, children: "Connect your app" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          margin: 0,
          fontSize: "var(--text-sm)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-ui)",
          lineHeight: "var(--line-height-tight)"
        }, children: "Paste near the top of your React Native entry file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onAutoSetup,
          style: { ...BTN_PRIMARY, height: 30 },
          title: "Pick your project folder and set up the connection automatically",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { size: 12 }),
            "Set it up for me"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      display: "flex",
      gap: "var(--space-2)",
      marginBottom: "var(--space-4)"
    }, children: ["Copy snippet", "Paste in index.js", "Reload app"].map((text, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      padding: "var(--space-2) var(--space-3)",
      borderRadius: "var(--radius-md)",
      background: "var(--bg-card)",
      border: "1px solid var(--border-subtle)",
      fontSize: "var(--text-xs)",
      color: "var(--text-secondary)",
      fontFamily: "var(--font-ui)",
      lineHeight: "var(--line-height-tight)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        width: 18,
        height: 18,
        borderRadius: "50%",
        flexShrink: 0,
        background: "var(--status-info-bg)",
        color: "var(--status-info-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: "var(--font-weight-semibold)",
        fontFamily: "var(--font-mono)"
      }, children: i + 1 }),
      text
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "var(--space-2) var(--space-3)",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
          fontSize: "var(--text-xs)",
          fontWeight: "var(--font-weight-medium)",
          color: "var(--text-tertiary)",
          fontFamily: "var(--font-ui)"
        }, children: "rnClient.js" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: copy, style: {
          ...BTN_GHOST,
          color: copied ? "var(--status-success-text)" : "var(--text-tertiary)"
        }, children: [
          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 11 }),
          copied ? "Copied" : "Copy"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: {
        margin: 0,
        padding: "var(--space-3)",
        maxHeight: 360,
        overflow: "auto",
        fontSize: "var(--text-xs)",
        lineHeight: "var(--line-height-normal)",
        fontFamily: "var(--font-mono)",
        color: "var(--text-secondary)",
        background: "var(--bg-code-block)",
        userSelect: "text"
      }, children: snippet })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      marginTop: "var(--space-3)",
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2)",
      fontSize: "var(--text-xs)",
      color: "var(--text-tertiary)",
      fontFamily: "var(--font-ui)",
      lineHeight: "var(--line-height-tight)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 11, color: "var(--text-tertiary)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Same network required · connects to",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { style: {
          fontFamily: "var(--font-mono)",
          color: "var(--text-secondary)",
          background: "var(--bg-code-block)",
          padding: "1px 4px",
          borderRadius: 3,
          fontSize: "var(--text-xs)"
        }, children: [
          "ws://",
          host,
          ":",
          port
        ] })
      ] })
    ] })
  ] }) });
}
export {
  RnspyDevtoolsPage as default
};
