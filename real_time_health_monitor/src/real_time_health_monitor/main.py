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
        'vitals_input': 'Record_ID: 87, Heart Rate: 145, Body Temperature: 37.1, Activity Status: Low, Latitude: 12.927365, Longitude: 80.116767, Heart Rate Variability: 23.67'
    }
    
    try:
        print("## Starting Real Time Health Monitor Analysis...")
        RealTimeHealthMonitor().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

if __name__ == "__main__":
    run()