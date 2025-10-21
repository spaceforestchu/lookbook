-- Update SpideySense project with a two-paragraph description

UPDATE lookbook_projects
SET summary = 'SpideySense is an innovative wearable prototype that leverages advanced motion sensors, environmental detectors, and machine learning algorithms to predict potential hazards before they occur. The device continuously monitors the wearer''s motion patterns, nearby vibrations, changes in air pressure, and electromagnetic fields to build a real-time risk assessment model. By analyzing these multiple data streams simultaneously, SpideySense can alert users to dangers ranging from structural instabilities to approaching objects, providing crucial seconds of warning time.

The system uses a sophisticated neural network trained on thousands of hazard scenarios to minimize false positives while maintaining high sensitivity to genuine threats. Originally developed as a safety tool for construction workers and first responders, the technology has applications in sports, elderly care, and accessibility aids for individuals with sensory impairments. The current prototype features haptic feedback, audio alerts, and a companion mobile app that logs incidents and refines the prediction model over time based on user feedback and real-world performance data.'
WHERE project_id = 5;
