#!/usr/bin/env python

'''
tag_generator-v1
Adaptação: Joao Oliveira
'''

import glob
import os

post_dir = '_posts/'
tag_dir  = 'tag/'
categories_dir  = 'categories/'


def create_tags():
    filenames = glob.glob(post_dir + '*md')
    total_tags = []

    for filename in filenames:
        f = open(filename, 'r', encoding='utf-8')
        crawl = False
        for line in f:
            if crawl:
                current_tags = line.strip().split()
                try:
                    if current_tags[0] == 'tags:':
                        total_tags.extend(current_tags[1:])
                        crawl = False
                        break
                except:
                    print("valor null")
            if line.strip() == '---':
                if not crawl:
                    crawl = True
                else:
                    crawl = False
                    break
        f.close()
    
    total_tags = set(total_tags)

    old_tags = glob.glob(tag_dir + '*.md')
    for tag in old_tags:
        os.remove(tag)
        
    if not os.path.exists(tag_dir):
        os.makedirs(tag_dir)

    for tag in total_tags:
        tag_filename = tag_dir + tag + '.md'
        f = open(tag_filename, 'a')
        write_str = '---\nlayout: tagpage\ntitle: \"Tag: ' + tag + '\"\ntag: ' + tag + '\n---\n'
        f.write(write_str)
        f.close()
        
    print("Tags generated, count", len(total_tags))


#categories
def create_categories():
    filenames = glob.glob(post_dir + '*md')
    total_categories = []

    for filename in filenames:
        f = open(filename, 'r', encoding='utf-8')
        crawl = False
        for line in f:
            if crawl:
                current_categories = line.strip().split()
                try:
                    if current_categories[0] == 'categories:':
                        total_categories.extend(current_categories[1:])
                        crawl = False
                        break
                except:
                    print("valor null")
            if line.strip() == '---':
                if not crawl:
                    crawl = True
                else:
                    crawl = False
                    break
        f.close()
    
    total_categories = set(total_categories)

    old_categories = glob.glob(categories_dir + '*.md')
    for categories in old_categories:
        os.remove(categories)
        
    if not os.path.exists(categories_dir):
        os.makedirs(categories_dir)

    for categories in total_categories:
        categories_filename = categories_dir + categories + '.md'
        f = open(categories_filename, 'a')
        write_str = '---\nlayout: categories\ntitle: \"categories: ' + categories + '"\ncategories: ' + categories + '\n---\n'
        f.write(write_str)
        f.close()
        
    print("Categories generated, count", len(total_categories))

create_tags()
create_categories()
print ("Yeah boy, its work!")