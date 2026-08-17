/* Design reminder — L’Atelier de l’Ouverture conserve des thèmes clair et sombre : contrastes feutrés, vert encre et safran de décision. */
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, useParams } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Lesson from "./pages/Lesson";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import Path from "./pages/Path";
import Leaderboard from "./pages/Leaderboard";


// Routes are intentionally kept in one place so Vercel SPA rewrites and
// client navigation share the same deep-link contract.
function LegacyRedirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to); }, [setLocation, to]);
  return null;
}

function LegacyLessonRedirect() {
  const { id = "1" } = useParams<{ id: string }>();
  return <LegacyRedirect to={`/lesson/${id}`} />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/lesson/:id"} component={Lesson} />
      <Route path={"/account"} component={Account} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/path"} component={Path} />
      <Route path={"/ranking"} component={Leaderboard} />
      <Route path={"/lecon/:id"}><LegacyLessonRedirect /></Route>
      <Route path={"/compte"}><LegacyRedirect to="/account" /></Route>
      <Route path={"/profil"}><LegacyRedirect to="/profile" /></Route>
      <Route path={"/parcours"}><LegacyRedirect to="/path" /></Route>
      <Route path={"/classement"}><LegacyRedirect to="/ranking" /></Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

// The providers wrap every route: theme and locale are UI state, while
// Analytics/Speed Insights are mounted once to avoid duplicate telemetry.
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Analytics />
            <SpeedInsights />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
