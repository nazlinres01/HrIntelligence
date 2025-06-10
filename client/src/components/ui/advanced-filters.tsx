import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "dateRange";
  options?: { value: string; label: string }[];
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  onFilterChange: (filters: Record<string, any>) => void;
  activeFilters: Record<string, any>;
}

export function AdvancedFilters({ filters, onFilterChange, activeFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setLocalFilters({});
    setDateRange({});
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(activeFilters).filter(key => activeFilters[key]).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="w-4 h-4 mr-2" />
          Gelişmiş Filtreler
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Gelişmiş Filtreler</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-1">
                <Label htmlFor={filter.key}>{filter.label}</Label>
                
                {filter.type === "text" && (
                  <Input
                    id={filter.key}
                    value={localFilters[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    placeholder={`${filter.label} ara...`}
                  />
                )}

                {filter.type === "select" && (
                  <Select
                    value={localFilters[filter.key] || ""}
                    onValueChange={(value) => handleFilterChange(filter.key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`${filter.label} seçin`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tümü</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {filter.type === "number" && (
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localFilters[`${filter.key}_min`] || ""}
                      onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localFilters[`${filter.key}_max`] || ""}
                      onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                    />
                  </div>
                )}

                {filter.type === "date" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {localFilters[filter.key] ? (
                          format(new Date(localFilters[filter.key]), "dd MMM yyyy", { locale: tr })
                        ) : (
                          <span>Tarih seçin</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={localFilters[filter.key] ? new Date(localFilters[filter.key]) : undefined}
                        onSelect={(date) => handleFilterChange(filter.key, date?.toISOString())}
                        initialFocus
                        locale={tr}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {filter.type === "dateRange" && (
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "dd MMM", { locale: tr })} -{" "}
                                {format(dateRange.to, "dd MMM yyyy", { locale: tr })}
                              </>
                            ) : (
                              format(dateRange.from, "dd MMM yyyy", { locale: tr })
                            )
                          ) : (
                            <span>Tarih aralığı seçin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={(range) => {
                            setDateRange(range || {});
                            handleFilterChange(`${filter.key}_from`, range?.from?.toISOString());
                            handleFilterChange(`${filter.key}_to`, range?.to?.toISOString());
                          }}
                          numberOfMonths={2}
                          locale={tr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={applyFilters} className="flex-1">
              Filtreleri Uygula
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Temizle
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}