"use client"

import { Product } from "@/components/product";
import { ProductSkeleton } from "@/components/productskeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Product as ProductType } from "@/db";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators/product-validor";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import { useState } from "react";


const SORT_OPTIONS = [
  {name: "None", value: "none"},
  {name: "Price: Low to High", value: "price-asc"},
  {name: "Price: High to Low", value: "price-desc"},
] as const;
const SUBCATEGORIES = [
  {name: "T-Shirts", selected: false,href: "#"},
  {name: "Hoodies", selected: false,href: "#"},
  {name: "Sweatshirts", selected: false,href: "#"},
  {name: "Accessories", selected: false,href: "#"},
] as const;

const SIZE_FILTERS = {
  id:  "size",
  name: "Size",
  options: [
    {name: "S", value: "s"},
    {name: "M", value: "m"},
    {name: "L", value: "l"},
  ] as const
}

const COLOR_FILTERS = {
  id:  "color",
  name: "Color",
  options: [
    {name: "White", value: "white"},
    {name: "Beige", value: "beige"},
    {name: "Blue", value: "blue"},
    {name: "Green", value: "green"},
    {name: "Purple", value: "purple"},
  ] as const
}

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  option: [{value: [0,100], label: "Any price"}, 
  {
    value: [0,20],
    label: "Under 20"
  },
  {
    value: [0,20],
    label: "Under 40"
  }
]
}
const DEFAUL_CUSTOM_PRICE = [0,100] as [number, number]
export default function Home() {
  const  [ filter, setFilter ] = useState<ProductState>({
    color: ["beige","blue", "green", "purple", "white"],
    price: {isCustom: false, ranger:DEFAUL_CUSTOM_PRICE},
    size: ["L", "M", "S"],
    sort: 'none',
  });


  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<ProductType>[]>('http://localhost:3000/api/products', {
        filter: {
          sort: filter.sort,
        }
      })
      return data
    },
  })


  const applyArrayFilter = ({
    category, value
  }: {
    category: keyof Omit<typeof filter, "price"| "sort">
    value: string
  }) => {
    const isFilterApplied = filter[category].includes(value as never)
    if(isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value)
      }))
    }else {
      setFilter((prev) => ({
        ...prev,
        [category]:[...prev[category], value]
      }))
    }
  }

  console.log(filter)
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tighter text-gray-900">
          High-quality cotton selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center tent-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 size-5  flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button 
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-500": filter.sort !== option.value,
                    "text-gray-900 bg-gray-100": filter.sort === option.value,
                  })}
                  key={option.name} 
                  onClick={() => {
                  setFilter({
                   ...filter,
                    sort: option.value,
                  });
                }}>
                  {option.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-500 hover:text-gray-500 sm:ml-6"></button>
        </div>
      </div>
      <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              
              <div className="hidden lg:block">
                <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  {SUBCATEGORIES.map((category) => (
                    <li key={category.name}>
                      <button disabled={!category.selected} className="disabled:cursor-not-allowed disabled:opacity-60">
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                <Accordion type="multiple" className="animate-none">
                  <AccordionItem value="color">
                    <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Color</span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <ul className="space-y-4">
                        {COLOR_FILTERS.options.map((option, i) => (
                          <li key={option.value} className="flex items-center">
                            <input  
                              onChange={() => {
                                applyArrayFilter({
                                  category: "color",
                                  value: option.value
                                })
                              }}
                              checked={filter.color.includes(option.value)}
                              type="checkbox" 
                              id={`color-${i}`}
                              className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`color-${i}`} className="ml-3 text-sm text-gray-600">
                              {option.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="size">
                    <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Size</span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <ul className="space-y-4">
                        {SIZE_FILTERS.options.map((option, i) => (
                          <li key={option.value} className="flex items-center">
                            <input  
                              onChange={() => {
                                applyArrayFilter({
                                  category: "size",
                                  value: option.name
                                })
                              }}
                              checked={filter.size.includes(option.name)}
                              type="checkbox" 
                              id={`size-${i}`}
                              className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`size-${i}`} className="ml-3 text-sm text-gray-600">
                              {option.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>


                  <AccordionItem value="price">
                    <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Price</span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <ul className="space-y-4">
                        {SIZE_FILTERS.options.map((option, i) => (
                          <li key={option.value} className="flex items-center">
                            <input  
                              onChange={() => {
                                applyArrayFilter({
                                  category: "size",
                                  value: option.name
                                })
                              }}
                              checked={filter.size.includes(option.name)}
                              type="checkbox" 
                              id={`size-${i}`}
                              className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`size-${i}`} className="ml-3 text-sm text-gray-600">
                              {option.name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

                {products ? 
                (products?.map((product) => (
                  <Product 
                    key={product.id} 
                    product={product.metadata!}
                  />)
                )) 
                :  new Array(12)
                .fill(null)
                  .map((_,i) => (
                  <ProductSkeleton key={i}/>
              ))}
              </ul>
          </div>
      </section>
    </main>
  );
}
