#!/usr/bin/env python3
"""
Validate the challenges.json file to ensure all 30 challenges are properly structured
"""

import json
from collections import Counter

def validate_challenges():
    try:
        with open('scripts/challenges.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        challenges = data.get('challenges', [])
        
        print(f"📊 Total challenges found: {len(challenges)}")
        
        if len(challenges) != 30:
            print(f"❌ Expected 30 challenges, found {len(challenges)}")
            return False
        
        # Check difficulty distribution
        difficulties = [c.get('difficulty') for c in challenges]
        difficulty_count = Counter(difficulties)
        
        print("\n🎯 Difficulty Distribution:")
        for diff, count in difficulty_count.items():
            print(f"  {diff}: {count}")
        
        expected_distribution = {
            'Beginner': 10,
            'Intermediate': 10, 
            'Advanced': 5,
            'Expert': 5
        }
        
        # Validate distribution
        all_good = True
        for diff, expected in expected_distribution.items():
            actual = difficulty_count.get(diff, 0)
            if actual != expected:
                print(f"❌ {diff}: Expected {expected}, found {actual}")
                all_good = False
            else:
                print(f"✅ {diff}: {actual} challenges (correct)")
        
        # Check points distribution
        print("\n💰 Points Distribution:")
        points_count = Counter([c.get('points') for c in challenges])
        for points, count in sorted(points_count.items()):
            print(f"  {points} points: {count} challenges")
        
        # Validate required fields
        print("\n🔍 Validating required fields...")
        required_fields = ['_id', 'title', 'description', 'difficulty', 'points', 'category']
        
        for i, challenge in enumerate(challenges, 1):
            missing_fields = [field for field in required_fields if field not in challenge]
            if missing_fields:
                print(f"❌ Challenge {i}: Missing fields: {missing_fields}")
                all_good = False
        
        if all_good:
            print("✅ All challenges have required fields!")
        
        # Check for unique IDs
        ids = [c.get('_id') for c in challenges]
        if len(set(ids)) != len(ids):
            print("❌ Duplicate IDs found!")
            all_good = False
        else:
            print("✅ All challenge IDs are unique!")
        
        # Check ID range
        expected_ids = set(range(1, 31))
        actual_ids = set(ids)
        if actual_ids != expected_ids:
            missing = expected_ids - actual_ids
            extra = actual_ids - expected_ids
            if missing:
                print(f"❌ Missing IDs: {sorted(missing)}")
            if extra:
                print(f"❌ Extra IDs: {sorted(extra)}")
            all_good = False
        else:
            print("✅ All IDs are in correct range (1-30)!")
        
        print(f"\n{'✅ All validations passed!' if all_good else '❌ Some validations failed!'}")
        return all_good
        
    except FileNotFoundError:
        print("❌ challenges.json file not found!")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    validate_challenges()
