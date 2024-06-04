import { useState, useEffect } from 'react'

export function useAppFunctions() {
    const [userNames, setUserNames] = useState([]);
    const [userName, setUserName] = useState('');
    const [userNameError, setUsernameError] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [terms, setTerms] = useState(false);
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [minutes, setMinutes] = useState(10);
    const [seconds, setSeconds] = useState(0);
    const [timesUp, setTimesUp] = useState(false);
    const [info, setInfo] = useState(false);
    const [resultData, setResultData] = useState([]);

    const handleInfoClick = () => {
        setInfo(!info);
    };

    const handleTermsSubmit = () => {
        setTerms(!terms);
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === 'terms' && terms || event.target.id === 'info' && info) {
          setTerms(false);
          setInfo(false);
        }
    };

    const handleBeforeUnload = () => {
        localStorage.removeItem('topic');
    };

    useEffect(() => {
        let countdownTime = minutes * 60 + seconds;
        let intervalId;

        const updateTimer = () => {
          setMinutes(Math.floor(countdownTime / 60));
          setSeconds(countdownTime % 60);
          countdownTime -= 1;

          if (countdownTime < 0) {
            clearInterval(intervalId);
            setTimesUp(true);
          }
        };

        intervalId = setInterval(updateTimer, 500);

        return () => {
          clearInterval(intervalId);
        };
    }, [minutes, seconds]);

    const startTimer = () => {
        setMinutes(10);
        setSeconds(0);
        setTimesUp(false);
    };

    useEffect(() => {
        const storedUserNames = JSON.parse(localStorage.getItem('userNames')) || [];
        const storedUserName = localStorage.getItem('userName');
        const storedTopic = localStorage.getItem('topic');
        const storedResultData = JSON.parse(localStorage.getItem('resultData')) || [];

        if(storedUserNames.length > 0) {
          setUserNames(storedUserNames);
        }
        
        if(storedResultData.length > 0) {
          setResultData(storedResultData);
        }

        if (storedUserName && !storedTopic) {
          setUserName(storedUserName);
          setShowContent(true);
          setUsernameError(null);
        } else if (storedUserName && storedTopic) {
          setUserName(storedUserName);
          setUsernameError(null);
          setShowContent(true);
          setTopic(storedTopic);
          setSubject(true);
          startTimer();
        } else {
          setShowContent(false);
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleNameSubmit = (enteredName) => {
        if (enteredName === '') {
            setUsernameError('Please enter your name!');
            setIsLoading(false); 
        } else if (enteredName.length < 3) {
            setUsernameError('Must be 3 characters long!');
            setIsLoading(false); 
        } else if (!enteredName.match(/^[a-zA-Z\s]+$/)) {
            setUsernameError('Please enter a valid name!');
            setIsLoading(false); 
        } else if (enteredName.length > 25) {
          setUsernameError('Must be 25 characters or less!');
          setIsLoading(false);
        } else {
            setUsernameError(null);
            setIsLoading(true);

            const userNameEntered = enteredName.trim();

            if (userNames.includes(userNameEntered)) {
                setTimeout(() => {
                    localStorage.setItem('userName', userNameEntered);
                    setUserName(userNameEntered);
                    setShowContent(true);
                    setIsLoading(false);
                }, 1500);
            } else {
                const loadingTimeout = setTimeout(() => {
                    setIsLoading(false);
                    localStorage.setItem('userName', userNameEntered);
                    setUserName(userNameEntered);
                    setShowContent(true);

                  
                    const updatedUserNames = [...userNames, userNameEntered];
                    setUserNames(updatedUserNames);
                    localStorage.setItem('userNames', JSON.stringify(updatedUserNames));
                }, 1500);

                return () => {
                    clearTimeout(loadingTimeout);
                };
            }
        }
    };

    
    const removeUserName = (nameToRemove) => {
        const updatedUserNames = userNames.filter(name => name !== nameToRemove);
        const updatedResultData = resultData.filter(result => result.username !== nameToRemove);
        setUserNames(updatedUserNames);
        setResultData(updatedResultData);
        localStorage.setItem('userNames', JSON.stringify(updatedUserNames));
        localStorage.setItem('resultData', JSON.stringify(updatedResultData));
    };
    const handleLogout = () => {
        setIsLoading(true);

        const loadingTimeout = setTimeout(() => {
          setIsLoading(false);

          localStorage.removeItem('userName');
          localStorage.removeItem('topic');
          setUserName('');
          setTopic('');
          setShowContent(false);
          setSubject(false);
        }, 1000);

        return () => {
          clearTimeout(loadingTimeout);
        };
    };
    const handleLeaveQuiz = () => {
        setIsLoading(true);

        const loadingTimeout = setTimeout(() => {
          setIsLoading(false);

          localStorage.removeItem('topic');
          setTopic('');
          setShowContent(true);
          setSubject(false);
          startTimer(); 
        }, 2000);

        return () => {
          clearTimeout(loadingTimeout);
        };
    };
    const handleTopicSubmit = (clickedTopic) => {
        setIsLoading(true);

        const loadingTimeout = setTimeout(() => {
          setIsLoading(false);

          localStorage.setItem('topic', clickedTopic);
          setTopic(clickedTopic);
          setSubject(true);
          startTimer();
        }, 2500);

        return () => {
          clearTimeout(loadingTimeout);
        };
    };
    const handleResultData = (username, score, topic) => {
        const newResult = {
          username,
          score,
          topic,
        };
        const existingIndex = resultData.findIndex((item) => item.topic === topic && item.username === username);
        
        if (existingIndex !== -1) {
          const updatedResultData = [...resultData];
          updatedResultData[existingIndex] = newResult;
          
          setResultData(updatedResultData);
          localStorage.setItem('resultData', JSON.stringify(updatedResultData));
        } else {
          setResultData((prevResultData) => [...prevResultData, newResult]);
          const storedResultData = JSON.parse(localStorage.getItem('resultData')) || [];
          const updatedStoredResultData = [...storedResultData, newResult];
          localStorage.setItem('resultData', JSON.stringify(updatedStoredResultData));
        }
        setIsLoading(true);

        const loadingTimeout = setTimeout(() => {
          setIsLoading(false);

          localStorage.removeItem('topic');
          setTopic('');
          setShowContent(true);
          setSubject(false);
          startTimer();
        }, 2000);

        return () => {
          clearTimeout(loadingTimeout);
        };
    };


    return {
        userNames,
        userName,
        userNameError,
        showContent,
        terms,
        info,
        topic,
        subject,
        isLoading,
        minutes,
        seconds,
        timesUp,
        resultData,
        handleNameSubmit,
        removeUserName,
        handleTermsSubmit,
        handleInfoClick,
        handleLogout,
        handleLeaveQuiz,
        handleOutsideClick,
        handleTopicSubmit,
        handleResultData,
    };
}
