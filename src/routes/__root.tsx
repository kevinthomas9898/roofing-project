import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import appCss from "../styles.css?url";
import { WHOP_CONFIG } from "@/lib/whop-config";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: `${WHOP_CONFIG.company.name} | Austin, TX Roof Repair, Replacement & Inspections`,
      },
      {
        name: "description",
        content:
          "Professional residential roofing services in Austin, Texas. Roof repair, full replacement, $149 inspections, and deposit checkout powered by Whop Websites.",
      },
      { property: "og:title", content: "Summit Roofing Co. | Protecting Your Home, One Roof at a Time" },
      {
        property: "og:description",
        content: "Expert roof repairs, replacements, and inspections for homeowners across Austin, Texas.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#10243A" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const pixelScript = `
    !function(w,d,s,u,n){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}
    (window,document,"script","https://t.whop.tw","whop");
    if(window.whop && typeof window.whop.setScope === 'function'){
      window.whop.setScope("${WHOP_CONFIG.accountId}");
      window.whop.track("page");
    }
  `;

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: pixelScript }} />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
