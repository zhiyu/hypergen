from recursive.utils.register import Register
from abc import ABC, abstractmethod


prompt_register = Register("prompt_register")


class PromptTemplate(ABC):
    def __init__(self, 
                 system_message,
                 content_template) -> None:
        super().__init__()
        self.system_message = system_message
        self.content_template = content_template
        
    def construct_system_message(self, **system_message_key_mapping):
        if len(system_message_key_mapping) == 0 :
            return self.system_message
        else:
            # to_run_check_str
            system_msg = self.system_message
            for k, v in system_message_key_mapping.items():
                if k is None or v is None: continue
                system_msg = system_msg.replace(k, v)
            return system_msg
    
    def construct_prompt(self, **key_mapping):
        if len(key_mapping) == 0:
            return self.content_template
        else:
            return self.content_template.format(**key_mapping)