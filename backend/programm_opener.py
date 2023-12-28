import os
import difflib

def get_available_programs():
    programs = []
    for root, dirs, files in os.walk("C:\\Program Files"):
        for file in files:
            if file.endswith(".exe"):
                programs.append(os.path.splitext(file)[0])
    return programs

def find_closest_match(input_name, program_list):
    matches = difflib.get_close_matches(input_name, program_list)
    return matches[0] if matches else None

def main():
    # Get the list of available programs
    available_programs = get_available_programs()

    # Get the program name from the user
    program_name = input("Enter the name of the program: ")

    # Check if the program exists
    if program_name in available_programs:
        program_path = os.path.join("C:\\Program Files", f"{program_name}.exe")
        os.startfile(program_path)
        print(f"Opening {program_name}...")
    else:
        # Find the closest match
        closest_match = find_closest_match(program_name, available_programs)

        if closest_match:
            user_response = input(f"Did you mean '{closest_match}'? (yes/no): ").lower()
            if user_response == 'yes':
                program_path = os.path.join("C:\\Program Files", f"{closest_match}.exe")
                os.startfile(program_path)
                print(f"Opening {closest_match}...")
            else:
                print("Program not found. Exiting.")
        else:
            print("No matching program found. Exiting.")

if __name__ == "__main__":
    main()
