import re
import traceback

try:
    with open('src/app/auth/AuthPageClient.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Typography replacements
    content = re.sub(r'text-\[10px\]\s+font-black\s+uppercase\s+tracking-widest\s+text-\[\#88D0F5\]/50', r'text-sm font-medium text-white/80', content)
    content = re.sub(r'text-\[10px\]\s+font-black\s+uppercase\s+tracking-widest', r'text-sm font-medium', content)
    content = re.sub(r'text-\[10px\]\s+font-black\s+uppercase\s+tracking-\[0\.\d+em\]', r'text-sm font-medium', content)
    content = re.sub(r'text-\[9px\]\s+font-black\s+uppercase\s+tracking-widest', r'text-sm font-medium', content)
    content = re.sub(r'text-\[8px\]\s+font-black\s+uppercase\s+tracking-\[0\.\d+em\]', r'text-sm font-medium', content)
    content = re.sub(r'font-black\s+uppercase\s+italic\s+tracking-tightest', r'font-bold', content)
    content = re.sub(r'text-[89]px', r'text-sm', content)
    content = re.sub(r'text-\[10px\]', r'text-sm', content)
    content = re.sub(r'text-\[11px\]', r'text-sm', content)

    # Simplified background & border replacements
    content = re.sub(r'bg-white/\[0\.03\]', r'bg-white/10', content)
    content = re.sub(r'bg-white/\[0\.05\]', r'bg-white/10', content)
    content = re.sub(r'border-white/5', r'border-white/20', content)
    content = re.sub(r'text-white outline-none transition-all focus:bg-white/\[0\.05\]', r'text-white outline-none transition-all focus:bg-white/20', content)
    
    # Specific flashy element removal / tone down
    content = content.replace('shadow-[0_0_10px_#22d3ee]', '')

    # Lexicon replacements: Left Panel
    content = content.replace('Define <br />\n                                    Your <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Legacy.</span>', 'Welcome to <br />\n                                    <span className="text-primary underline decoration-primary/20 underline-offset-[12px]">Maestro.</span>')
    content = content.replace('Join an elite ecosystem of innovators. Authenticate to access proprietary psychometric frameworks and tailored industrial roadmaps.', 'Sign in or create an account to access our career platform and personalized roadmaps.')
    content = content.replace('Next-Gen Career Intelligence', 'Maestro Career Platform')
    
    # Lexicon replacements: Authorization generic
    content = content.replace('Synchronize Password', 'Reset Password')
    content = content.replace('Digital signature reset in progress', 'Set a new password for your account')
    content = content.replace('Access Portal', 'Sign In')
    content = content.replace('Enlist', 'Register')
    
    # Lexicon replacements: Login mode strings
    content = content.replace('Password Cluster', 'Password')
    content = content.replace('OTP Synchronization', 'OTP')
    content = content.replace('Digital Mail', 'Email Address')
    content = content.replace('Security Key', 'Password')
    content = content.replace('Decrypt Access?', 'Forgot Password?')
    content = content.replace('Establish Access', 'Sign In')
    content = content.replace('Distribution Node (Email)', 'Email Address')
    content = content.replace('6-Digit Sync Hash', '6-Digit OTP')
    content = content.replace('Transmitting...', 'Sending OTP...')
    content = content.replace('Verify Sync', 'Verify OTP')
    
    # Lexicon replacements: Register Mode Strings
    content = content.replace('Proceed to Node 02', 'Next Step')
    content = content.replace('Node 01', 'Step 1')
    content = content.replace('Node 02', 'Step 2')
    content = content.replace('Node 03', 'Step 3')
    content = content.replace('Legal Name', 'Full Name')
    content = content.replace('Communication Node (Email)', 'Email Address')
    content = content.replace('Area Code', 'Country Code')
    content = content.replace('Link Number', 'Mobile Number')
    content = content.replace('Access Token', 'Password')
    content = content.replace('Create robust password', 'Create a strong password')
    content = content.replace('Origin Date (DOB)', 'Date of Birth')
    content = content.replace('Accept Maestro protocols, privacy index, and digital verification flow.', 'I accept the Terms of Service and Privacy Policy.')
    content = content.replace('Sync Verification', 'OTP Verification')
    content = content.replace('Enter the verification hash dispatched to', 'Enter the 6-digit OTP sent to')
    content = content.replace('Reconfigure', 'Go Back')
    content = content.replace('Validate Node', 'Verify OTP')
    content = content.replace('Legacy Class', 'I am a')
    content = content.replace('Student Entry', 'Student')
    content = content.replace('Pro Entry', 'Working Professional')
    content = content.replace('Current Stream', 'Field of Study')
    content = content.replace('Active Domain', 'Industry / Domain')
    content = content.replace('Designation', 'Job Title / Role')
    content = content.replace('Geo-Location (City)', 'City')
    content = content.replace('Establishing Nexus...', 'Completing Profile...')
    content = content.replace('Launch Dashboard', 'Complete Profile')

    # Forgot Password texts
    content = content.replace('Identity Recovery', 'Account Recovery')
    content = content.replace('Transmit Link', 'Send Reset Link')
    content = content.replace('Signal Sent successfully. verify your grid.', 'Reset link sent successfully. Check your email.')
    
    # Password Reset
    content = content.replace('Calibrate Access', 'Confirm Password')
    content = content.replace('Reconfiguring...', 'Resetting...')
    content = content.replace('New Credentials', 'New Password')
    content = content.replace('Verify Credentials', 'Confirm Password')
    content = content.replace('Complexity', '8+ Characters')
    content = content.replace('Uppercase', 'Uppercase Letter')
    content = content.replace('Lowercase', 'Lowercase Letter')
    content = content.replace('Numerical', 'Number')
    content = content.replace('Symbolic', 'Special Character')
    content = content.replace('Registry Match', 'Passwords Match')

    with open('src/app/auth/AuthPageClient.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print('Successfully applied replacements.')
except Exception as e:
    print('Error occurred:')
    traceback.print_exc()
