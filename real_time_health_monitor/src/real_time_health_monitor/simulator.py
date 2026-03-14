import pandas as pd
import asyncio

class VitalsSimulator:
    def __init__(self, csv_path: str, interval_seconds: int = 10):
        self.df = pd.read_csv(csv_path)
        self.interval = interval_seconds
        self.current_index = 0
        self.running = False

    def get_next_row(self) -> dict | None:
        if self.current_index >= len(self.df):
            self.current_index = 0  # loop back to start
        row = self.df.iloc[self.current_index]
        self.current_index += 1
        return row.to_dict()

    def format_vitals_input(self, row: dict) -> str:
        return (
            f"Record_ID: {row['Record_ID']}, "
            f"Heart Rate: {row['Heart_Rate']}, "
            f"Body Temperature: {row['Body_Temperature']}, "
            f"Blood Pressure: {row['Blood_Pressure']}, "
            f"Blood Oxygen: {row['Blood_Oxygen']}, "
            f"Activity Status: {row['Activity_Status']}, "
            f"Latitude: {row['Latitude']}, "
            f"Longitude: {row['Longitude']}, "
            f"Heart Rate Variability: {row['HRV']}"
        )