from datetime import datetime, timedelta

def convert_epoch_to_datetime(unix_ts):
    return (datetime.fromtimestamp(unix_ts) - timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S')
