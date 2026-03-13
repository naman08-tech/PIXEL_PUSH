from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from pydantic import BaseModel
from typing import List

# --- Pydantic Models ---
class VitalSign(BaseModel):
    name: str
    value: str
    status: str

class Agent1Output(BaseModel):
    vitals: List[VitalSign]
    abnormality_detected: bool

class Finding(BaseModel):
    reason: str
    confidence: str

class Agent2Output(BaseModel):
    assessment: str
    findings: List[Finding]
    logic_summary: str

@CrewBase
class RealTimeHealthMonitor(): # Updated class name to match project
    """RealTimeHealthMonitor crew orchestration"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def data_validator(self) -> Agent:
        return Agent(config=self.agents_config['data_validator'], verbose=True)

    @agent
    def medical_analyst(self) -> Agent:
        return Agent(config=self.agents_config['medical_analyst'], verbose=True)

    @agent
    def emergency_dispatcher(self) -> Agent:
        return Agent(config=self.agents_config['emergency_dispatcher'], verbose=True)

    @task
    def clean_and_flag_task(self) -> Task:
        return Task(config=self.tasks_config['clean_and_flag_task'], output_pydantic=Agent1Output)

    @task
    def analyze_abnormalities_task(self) -> Task:
        return Task(config=self.tasks_config['analyze_abnormalities_task'], output_pydantic=Agent2Output)

    @task
    def execute_response_task(self) -> Task:
        return Task(config=self.tasks_config['execute_response_task'], output_file='emergency_log.txt')

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents, 
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )