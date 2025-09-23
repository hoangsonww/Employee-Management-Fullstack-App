package com.example.employeemanagement.dto;

import java.util.List;

public class PageResponse<T> {
  public static class SortOrder {
    private String property;
    private String direction;

    public SortOrder() {}
    
    public SortOrder(String property, String direction) {
      this.property = property; 
      this.direction = direction; 
    }
    
    public String getProperty() { return property; }
    
    public void setProperty(String property) { this.property = property; }
    
    public String getDirection() { return direction; }
    
    public void setDirection(String direction) { this.direction = direction; }
  }

  private List<T> content;
  private int page;
  private int size;
  private long totalElements;
  private int totalPages;
  private List<SortOrder> sort;
  private boolean hasNext;
  private boolean hasPrevious;

  public List<T> getContent() { return content; }
  
  public void setContent(List<T> content) { this.content = content; }
  
  public int getPage() { return page; }
  
  public void setPage(int page) { this.page = page; }
  
  public int getSize() { return size; }
  
  public void setSize(int size) { this.size = size; }
  
  public long getTotalElements() { return totalElements; }
  
  public void setTotalElements(long totalElements) { this.totalElements = totalElements; }
  
  public int getTotalPages() { return totalPages; }
  
  public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
  
  public List<SortOrder> getSort() { return sort; }
  
  public void setSort(List<SortOrder> sort) { this.sort = sort; }
  
  public boolean isHasNext() { return hasNext; }
  
  public void setHasNext(boolean hasNext) { this.hasNext = hasNext; }
  
  public boolean isHasPrevious() { return hasPrevious; }
  
  public void setHasPrevious(boolean hasPrevious) { this.hasPrevious = hasPrevious; }
}