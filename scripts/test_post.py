"""Test script — posts carousel 0 immediately"""
import os
import sys

os.environ["CAROUSEL_INDEX"] = "0"

# Change to project root so __file__ paths work
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(project_root)
sys.path.insert(0, os.path.join(project_root, "scripts"))

from post_reel import main
main()
