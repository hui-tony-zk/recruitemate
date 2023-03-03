
import json
import logging
import datetime

class LoggerAdapter(logging.LoggerAdapter):
    """Add connection ID and client IP address to websockets logs."""
    def process(self, msg, kwargs):
        try:
            websocket = kwargs["extra"]["websocket"]
        except KeyError:
            return msg, kwargs
        kwargs["extra"]["event_data"] = {
            "connection_id": str(websocket.id),
            "remote_addr": websocket.request_headers.get("X-Forwarded-For"),
        }
        return msg, kwargs

class JSONFormatter(logging.Formatter):
    """
    Render logs as JSON.

    To add details to a log record, store them in a ``event_data``
    custom attribute. This dict is merged into the event.

    """
    def __init__(self):
        pass  # override logging.Formatter constructor

    def format(self, record):
        event = {
            "timestamp": self.getTimestamp(record.created),
            "message": record.getMessage(),
            "level": record.levelname,
            "logger": record.name,
        }
        event_data = getattr(record, "event_data", None)
        if event_data:
            event.update(event_data)
        if record.exc_info:
            event["exc_info"] = self.formatException(record.exc_info)
        if record.stack_info:
            event["stack_info"] = self.formatStack(record.stack_info)
        return json.dumps(event)

    def getTimestamp(self, created):
        return datetime.datetime.utcfromtimestamp(created).isoformat()
        
logging.basicConfig(
    format="%(asctime)s %(message)s",
    level=logging.INFO,
)
formatter = JSONFormatter()
handler = logging.StreamHandler()
handler.setFormatter(formatter)

logger = logging.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)