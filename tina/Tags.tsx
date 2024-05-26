import { wrapFieldsWithMeta } from "tinacms";
import { useState, useEffect, useRef } from "react";
import React from "react";

export const Tags = wrapFieldsWithMeta(({ field, input, meta }) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[] | string>(input.value || "");

  const prevTagsRef = useRef(tags);
  const prevInputValueRef = useRef(input.value);

  // Handle changes to the input.value prop
  useEffect(() => {
    if (prevInputValueRef.current !== input.value) {
      setTags(input.value || "");
      prevInputValueRef.current = input.value;
    }
  }, [input.value]);

  // Handle changes to the tags state
  useEffect(() => {
    if (prevTagsRef.current !== tags) {
      input.onChange(tags);
      prevTagsRef.current = tags;
    }
  }, [tags, input]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTag = () => {
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue === "") return;

    const sanitizeTag = (tag: string) => tag.trim().replace(/[^a-zA-Z0-9]/g, "-");

    const addUniqueTags = (newTags: string[]) => {
      const uniqueTags = newTags.filter((tag) => !tags.includes(tag));
      setTags((prevTags) => [...prevTags, ...Array.from(new Set(uniqueTags))]);
    };

    if (trimmedInputValue.includes(",")) {
      const newTags = trimmedInputValue.split(",").map(sanitizeTag);
      addUniqueTags(newTags);
    } else {
      const newTag = sanitizeTag(trimmedInputValue);
      if (!tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
    }

    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (typeof tags === "string") return;
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="relative mb-5 last:mb-0" style={{ zIndex: 995 }}>
      <div className="flex items-center gap-3">
        <input
          type="text"
          className="focus:shadow-outline block w-full flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-base text-gray-600 shadow-inner transition-all duration-150 ease-out placeholder:text-gray-300 focus:border-blue-500 focus:text-gray-900 focus:outline-none"
          placeholder="Add a tag"
          value={inputValue}
          onChange={handleInputChange}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleAddTag();
            }
          }}
        />
        <button
          className="icon-parent focus:shadow-outline inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-transparent bg-blue-500 text-center text-sm font-medium text-white shadow transition-all duration-150 ease-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddTag}
        >
          <svg
            viewBox="0 0 32 32"
            fill="inherit"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-5/6"
          >
            <path d="M14.9524 4.89689L14.9524 26.8016H16.7461L16.7461 4.89689H14.9524Z"></path>
            <path d="M4.8969 16.7461H26.8016L26.8016 14.9523H4.89689L4.8969 16.7461Z"></path>
          </svg>
        </button>
      </div>
      <span className="mb-0 mt-2 flex flex-wrap gap-2">
        {typeof tags !== "string" && tags.map((tag) => (
          <span
            key={tag}
            className="border-gray-150 flex items-center rounded-full border bg-white leading-none tracking-[0.01em] text-gray-700 shadow"
          >
            <span
              style={{ maxHeight: "calc(var(--tina-sidebar-width) - 50px)" }}
              className="flex-1 truncate py-1 pl-3 pr-1 text-sm"
            >
              {tag}
            </span>
            <button
              className="group flex flex-shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent py-1 pl-1 pr-2 text-center text-gray-300 hover:text-blue-500"
              onClick={() => handleRemoveTag(tag)}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="h-auto w-4 origin-center transition duration-100 ease-out group-hover:scale-110"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
              </svg>
            </button>
          </span>
        ))}
      </span>
    </div>
  );
});
