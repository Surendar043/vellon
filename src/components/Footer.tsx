import { footer, site } from '../data/site'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <a className="nav__brand" href="#top">
              <span className="nav__mark" aria-hidden="true">
                V
              </span>
              <span>{site.brand}</span>
            </a>
            <p className="footer__blurb">{footer.blurb}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="footer__heading">{column.title}</h2>
              <ul className="footer__links">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer__bottom">
          <span>
            © {site.year} {site.brand}. Built with React, TypeScript and a lot of CSS.
          </span>
          <span className="footer__legal">{footer.legal}</span>
        </div>
      </div>
    </footer>
  )
}
