#!/usr/bin/env python
import sys
import warnings
# IMPORTANT: The import must match your project folder name exactly
from real_time_health_monitor.crew import RealTimeHealthMonitor

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the Real Time Health Monitor Crew.
    """
    inputs = {
        'vitals_input': 'HRV: 50, Temperature: 98.6, HR: 145, SpO2: 98, motion: 1.4'
    }
    
    try:
        print("## Starting Real Time Health Monitor Analysis...")
        # Use the updated class name here
        RealTimeHealthMonitor().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

if __name__ == "__main__":
    run()