import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { Link } from "react-router"; // fix juga ini!
import NavItem from "./NavItem";
import { useRef } from "react";

const MobileSidebar = () => {
  const sidebarRef = useRef<SidebarComponent | null>(null); // ✅ gunakan useRef

  const toggleSidebar = () => {
      sidebarRef.current?.toggle();
  }

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="logo"
            className="size-[30px]"
          />
          <h1>Fizhtour</h1>
        </Link>
        <button onClick={() => sidebarRef.current?.toggle()}>
          {" "}
          {/* ✅ */}
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      <SidebarComponent
        width="270px"
        ref={sidebarRef} // ✅ pasangkan ref
        created={toggleSidebar} // ✅
        closeOnDocumentClick={true}
        showBackdrop={true}
        type="Over"
      >
        <NavItem handleClick = {toggleSidebar} />
      </SidebarComponent>
    </div>
  );
};

export default MobileSidebar;
