import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById("app").scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const goUp = () => {
  document.getElementById("app").scrollTo(0, 0);
};
