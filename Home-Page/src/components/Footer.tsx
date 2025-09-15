export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <p>© {new Date().getFullYear()} Student Portal. Built with React + Vite.</p>
                <nav className="footer__links" aria-label="Footer navigation">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Support</a>
                </nav>
            </div>
        </footer>
    );
}
