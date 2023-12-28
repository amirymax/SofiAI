from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume

def get_volume_control():
    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(
        IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume_control = cast(interface, POINTER(IAudioEndpointVolume))
    return volume_control

def set_volume(volume_level):
    volume_control = get_volume_control()
    volume_control.SetMasterVolumeLevelScalar(volume_level, None)

def get_volume():
    volume_control = get_volume_control()
    return volume_control.GetMasterVolumeLevelScalar()

# Example usage:
# Set volume to 50%:
set_volume(1)

# Get current volume level:
current_volume = get_volume()
print(f"Current volume: {current_volume}")
