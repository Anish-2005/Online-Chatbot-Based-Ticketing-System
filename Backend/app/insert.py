from database import shows_collections
async def insert_initial_data():
    show_detai1 ={
            'id': '1',
            'image': 'https://drive.google.com/file/d/180YSGElq8IK67IzZFzibKpbu4EDr2b6W/view?usp=drive_link',
            'title': 'General Entry',
            'date': 'September 19, 2024',
            'time': '10:00 AM – 5:00 PM',
            'location': 'Museum Main Hall',
            'price': '₹70 per person (includes access to all general exhibits)',
        }
    show_detai2 = {
        'id': '2',
        'image': 'https://drive.google.com/file/d/1xaIZgcqM0wrH_j-rf8snw_Or5BQQ6sp6/view?usp=drive_link',
        'title': 'Timeless Treasures',
        'date': 'September 20, 2024',
        'time': '11:00 AM – 3:00 PM',
        'location': 'Hall of History',
        'price': '₹100 per person (special exhibition of historical artifacts)',
    }
    show_detai3 = {
        'id': '3',
        'image': 'https://drive.google.com/file/d/1JV-VbDbTsei5YUGZjHkdOSa1zQCIavWr/view?usp=drive_link',
        'title': 'Art Through the Ages',
        'date': 'September 21, 2024',
        'time': '12:00 PM – 4:00 PM',
        'location': 'Gallery 1',
        'price': '₹120 per person (features art from different eras)',
    }
    show_detai4 = {
        'id': '4',
        'image': 'https://drive.google.com/file/d/1wwPQVHs-mv3JSil6oYBULn86XZrYJNMw/view?usp=drive_link',
        'title': 'Stories Untold',
        'date': 'September 22, 2024',
        'time': '1:00 PM – 5:00 PM',
        'location': 'Exhibition Hall',
        'price': '₹150 per person (uncover hidden stories from the past)',
    }
    show_detai5 = {
        'id': '5',
        'image': 'https://drive.google.com/file/d/11owy3tpDec0Eg43GcLMQL6569lrPMniF/view?usp=drive_link',
        'title': 'Modern Maestro',
        'date': 'September 23, 2024',
        'time': '10:00 AM – 2:00 PM',
        'location': 'Contemporary Art Section',
        'price': '₹100 per person (showcasing modern art)',
    }

    await shows_collections.insert_one(show_detai1)
    await shows_collections.insert_one(show_detai2)
    await shows_collections.insert_one(show_detai3)
    await shows_collections.insert_one(show_detai4)
    await shows_collections.insert_one(show_detai5)

