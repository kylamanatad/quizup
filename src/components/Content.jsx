import PropTypes from 'prop-types';
import Info from './Info';
import { BsQuestionLg, BsBoxArrowRight, BsBoxArrowUpRight } from 'react-icons/bs';

function Content({ 
    greeting, 
    heading, 
    subject, 
    handleLogout, 
    handleLeaveQuiz, 
    info,
    handleInfoClick,
    handleOutsideClick,
    children 
}) {
    
    return (
    <>
    {
    info && (
    <Info handleInfoClick={handleInfoClick} handleOutsideClick={handleOutsideClick} />
    )}
    <header>
        <h1><a href="/">Quiz <span className="theme-intruder"> U</span>p</a></h1>
        <div></div>
        <ul>
            {
            handleLeaveQuiz ? 
            <li title="Leave Quiz"><a onClick={handleLeaveQuiz}><BsBoxArrowUpRight size={25} /></a></li> 
            : subject ? 
            <li title={subject}>{subject}</li>
            :
            <>
            <li title="Info"><a onClick={handleInfoClick}><BsQuestionLg size={25} /></a></li>
            <li className="margin-left" title="Logout"><a onClick={handleLogout}><BsBoxArrowRight size={25} /></a></li>
            </>
            }
            </ul>
            </header>
            <main>
                <div className="heading-container">
                    {greeting && greeting}
                    {heading && heading}
                </div>
                {children && children}
            </main>
        </>
    )
}

Content.propTypes = {
    greeting: PropTypes.string,
    heading: PropTypes.string,
    subject: PropTypes.string,
    handleLogout: PropTypes.func,
    handleLeaveQuiz: PropTypes.func,
    info: PropTypes.bool,
    handleInfoClick: PropTypes.func,
    handleOutsideClick: PropTypes.func,
    children: PropTypes.node
}

export default Content;