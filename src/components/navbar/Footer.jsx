import './Footer.css';

const Footer = ({theme, setTheme}) => {
    const toggle_mode = () => {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    }

    return(<>
        <div className="footer">
            <div className="content-footer">
            </div>
        </div>
    </>)
}

export default Footer;