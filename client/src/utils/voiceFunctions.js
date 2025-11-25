// Clean voice assistant functions
export const createVoiceFunctions = (
    filters,
    setFilters,
    currentQuestion,
    setCurrentQuestion,
    questions,
    voiceMode,
    voiceMuted,
    isListening,
    setIsListening,
    setIsSpeaking,
    recognitionRef,
    synthRef,
    fetchRecommendations,
    setVoiceMode,
    setShowFilters,
    voiceNLP
) => {
    const speak = (text) => {
        if (voiceMuted || !voiceMode) return;
        
        // Pause listening while bot speaks
        const wasListening = isListening;
        if (wasListening && recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            setIsSpeaking(true);
        };
        
        utterance.onend = () => {
            setIsSpeaking(false);
            // Resume listening
            if (wasListening && voiceMode && recognitionRef.current) {
                setTimeout(() => {
                    try {
                        recognitionRef.current.start();
                        setIsListening(true);
                    } catch (error) {
                        if (!error.message?.includes('already started')) {
                            console.error('Error resuming recognition:', error);
                        }
                    }
                }, 800);
            }
        };
        
        synthRef.current.speak(utterance);
    };

    const handleVoiceInput = (transcript) => {
        const question = questions[currentQuestion];
        
        console.log('Voice input:', transcript, 'Question:', question.key);
        
        const result = voiceNLP.processInput(transcript, question);
        
        console.log('NLP result:', result);
        
        if (result.success) {
            setFilters(prev => ({ ...prev, [question.key]: result.value }));
            const label = result.label || result.value;
            speak(`Perfect, ${label}. Let's continue.`);
            setTimeout(() => nextQuestion(), 2000);
        } else if (result.error === 'out_of_range') {
            speak(`Please say a number between ${question.min} and ${question.max}`);
        } else {
            speak('I didn\'t catch that. Please try again or select manually.');
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            const nextQ = currentQuestion + 1;
            console.log('Moving to question', nextQ + 1);
            setCurrentQuestion(nextQ);
            setTimeout(() => {
                speak(questions[nextQ].text);
            }, 1500);
        } else {
            completeVoiceMode();
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            const prevQ = currentQuestion - 1;
            setCurrentQuestion(prevQ);
            setTimeout(() => {
                speak(questions[prevQ].text);
            }, 500);
        }
    };

    const completeVoiceMode = () => {
        speak('Great! I have all the information. Let me find the perfect rooms for you.');
        
        localStorage.setItem('roomFinderPreferences', JSON.stringify({
            userType: filters.userType,
            groupSize: filters.groupSize,
            stayDuration: filters.stayDuration,
            season: filters.season,
            maxPrice: filters.maxPrice
        }));
        
        setTimeout(() => {
            setVoiceMode(false);
            setShowFilters(false);
            fetchRecommendations();
            
            setTimeout(() => {
                document.querySelector('.results-section')?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 500);
        }, 3000);
    };

    return {
        speak,
        handleVoiceInput,
        nextQuestion,
        previousQuestion,
        completeVoiceMode
    };
};
