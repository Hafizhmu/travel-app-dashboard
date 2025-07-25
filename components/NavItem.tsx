import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

const NavItem = ({handleClick}: {handleClick?: () => void}) => {
  const user = {
    name: "John Doe",
    email: "john.doe@fizhtour.com",
    imageUrl: "/assets/images/david.webp",
  };
  return (
    <section className="nav-items">
      <Link to="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="siaz[30px]" />
        <h1>Fizhtour</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                onClick={handleClick}>
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-5 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name || "John Doe"}
          />
          <article>
            <h2>{user?.name || "John Doe"}</h2>
            <p>{user?.email || "john.doe@fizhtour.com"}</p>
          </article>
          <button
            onClick={() => {
              console.log("logout");
            }}
            className="cursor-pointer"
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
              className="size-6"
            />
          </button>
        </footer>
      </div>
    </section>
  );
};

export default NavItem;
